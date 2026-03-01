import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Container } from '@/shared/ui/container'
import { ROUTES } from '@/shared/config/routes'
import {
  GroupCategoryFilter,
  GroupDetailHeader,
  type GroupDetailHeaderData,
} from '@/features/groups'
import { RestaurantCard } from '@/entities/restaurant'
import { getGroup, getGroupReviewRestaurants, leaveGroup } from '@/entities/group'
import type { RestaurantListItemDto } from '@/entities/restaurant'
import { getFoodCategories } from '@/entities/restaurant'
import { getSubgroups, joinSubgroup, type SubgroupListItemDto } from '@/entities/subgroup'
import { useMemberGroups } from '@/entities/member'
import { getCurrentPosition, type GeoPosition } from '@/shared/lib/geolocation'
import { isValidId, parseNumberParam } from '@/shared/lib/number'
import { Skeleton } from '@/shared/ui/skeleton'
import { AlertDialog } from '@/shared/ui/alert-dialog'
import { ConfirmAlertDialogContent } from '@/shared/ui/confirm-alert-dialog'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { getApiErrorCode } from '@/shared/lib/apiError'

const CATEGORY_OPTIONS = [
  '한식',
  '중식',
  '일식',
  '양식',
  '아시안',
  '분식',
  '패스트푸드',
  '카페',
  '디저트',
  '주점',
  '고깃집',
]
const ALL_CATEGORY = '전체'
const JOIN_GUIDE_AUTO_CLOSE_MS = 2200
const JOIN_GUIDE_FADE_OUT_MS = 250

const EMPTY_GROUP: GroupDetailHeaderData = {
  name: '',
  addressLine: '',
  memberCount: 0,
}

export function GroupDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)
  const [group, setGroup] = useState<GroupDetailHeaderData | null>(null)
  const [emailDomain, setEmailDomain] = useState<string | null>(null)
  const [restaurants, setRestaurants] = useState<RestaurantListItemDto[]>([])
  const [isGroupLoading, setIsGroupLoading] = useState(false)
  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(false)
  const [groupError, setGroupError] = useState<string | null>(null)
  const [restaurantError, setRestaurantError] = useState<string | null>(null)
  const [subgroupPreviews, setSubgroupPreviews] = useState<SubgroupListItemDto[]>([])
  const [isSubgroupPreviewsLoading, setIsSubgroupPreviewsLoading] = useState(false)
  const [hasMoreSubgroups, setHasMoreSubgroups] = useState(false)
  const [selectedSubgroup, setSelectedSubgroup] = useState<SubgroupListItemDto | null>(null)
  const [subgroupJoinConfirmOpen, setSubgroupJoinConfirmOpen] = useState(false)
  const [subgroupPasswordDialogOpen, setSubgroupPasswordDialogOpen] = useState(false)
  const [subgroupPassword, setSubgroupPassword] = useState('')
  const [isJoiningSubgroup, setIsJoiningSubgroup] = useState(false)
  const [locationPosition, setLocationPosition] = useState<GeoPosition | null>(null)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [isGroupLoaded, setIsGroupLoaded] = useState(false)
  const groupId = parseNumberParam(id)
  const { summaries, isLoaded, refresh } = useMemberGroups()

  const joinedState =
    location.state && typeof location.state === 'object'
      ? (location.state as { joined?: boolean })
      : undefined
  const isFromOnboardingFlow =
    location.state && typeof location.state === 'object'
      ? (location.state as { fromOnboarding?: boolean }).fromOnboarding === true
      : false

  const shouldMarkJoined = Boolean(joinedState?.joined)
  const shouldShowOnboardingMemberGuide =
    new URLSearchParams(location.search).get('onboardingMemberGuide') === 'true'
  const [showJoinGuide, setShowJoinGuide] = useState(shouldShowOnboardingMemberGuide)
  const [isJoinGuideVisible, setIsJoinGuideVisible] = useState(shouldShowOnboardingMemberGuide)

  const dismissJoinGuide = useCallback(() => {
    setIsJoinGuideVisible(false)
    window.setTimeout(() => {
      setShowJoinGuide(false)
      if (shouldShowOnboardingMemberGuide) {
        navigate(location.pathname, { replace: true, state: location.state })
      }
    }, JOIN_GUIDE_FADE_OUT_MS)
  }, [location.pathname, location.state, navigate, shouldShowOnboardingMemberGuide])

  useEffect(() => {
    if (shouldShowOnboardingMemberGuide) {
      setShowJoinGuide(true)
      window.setTimeout(() => {
        setIsJoinGuideVisible(true)
      }, 0)
      return
    }
    setIsJoinGuideVisible(false)
    setShowJoinGuide(false)
  }, [shouldShowOnboardingMemberGuide])

  useEffect(() => {
    if (!showJoinGuide || !isJoinGuideVisible) return

    const timerId = window.setTimeout(() => {
      dismissJoinGuide()
    }, JOIN_GUIDE_AUTO_CLOSE_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [dismissJoinGuide, isJoinGuideVisible, showJoinGuide])

  useEffect(() => {
    if (!shouldMarkJoined) return

    toast.success('그룹 가입이 완료되었습니다')
    navigate(location.pathname, { replace: true })
  }, [navigate, location.pathname, shouldMarkJoined])

  useEffect(() => {
    let cancelled = false
    const fetchCategories = async () => {
      setIsCategoryLoading(true)
      try {
        const list = await getFoodCategories()
        if (cancelled) return
        const names = list.map((item) => item.name)
        setCategories(names)
        setSelectedCategory((prev) => prev ?? ALL_CATEGORY)
      } catch {
        if (cancelled) return
        setCategories(CATEGORY_OPTIONS)
        setSelectedCategory((prev) => prev ?? ALL_CATEGORY)
      } finally {
        if (!cancelled) {
          setIsCategoryLoading(false)
        }
      }
    }
    fetchCategories()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchLocation = async () => {
      setIsLocationLoading(true)
      setLocationError(null)
      try {
        const position = await getCurrentPosition()
        if (cancelled) return
        if (!position) {
          setLocationPosition(null)
          setLocationError('위치 정보를 확인할 수 없습니다.')
          return
        }
        setLocationPosition(position)
      } finally {
        if (!cancelled) {
          setIsLocationLoading(false)
        }
      }
    }
    fetchLocation()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isValidId(groupId)) return
    let cancelled = false
    const fetchSubgroupPreviews = async () => {
      setIsSubgroupPreviewsLoading(true)
      try {
        const response = await getSubgroups(groupId, { size: 3 })
        if (cancelled) return
        setSubgroupPreviews(response.items ?? [])
        setHasMoreSubgroups(Boolean(response.pagination?.hasNext))
      } catch {
        if (!cancelled) {
          setSubgroupPreviews([])
          setHasMoreSubgroups(false)
        }
      } finally {
        if (!cancelled) {
          setIsSubgroupPreviewsLoading(false)
        }
      }
    }
    void fetchSubgroupPreviews()
    return () => {
      cancelled = true
    }
  }, [groupId])

  useEffect(() => {
    if (!isValidId(groupId)) return
    let cancelled = false
    const fetchGroup = async () => {
      setIsGroupLoading(true)
      setGroupError(null)
      setIsGroupLoaded(false)
      try {
        const groupRes = await getGroup(groupId)
        if (cancelled) return
        setGroup({
          name: groupRes.name,
          profileImage: groupRes.logoImageUrl ?? groupRes.logoImage?.url ?? undefined,
          addressLine: groupRes.address,
          addressDetail: groupRes.detailAddress ?? undefined,
          memberCount: groupRes.memberCount ?? 0,
        })
        setEmailDomain(groupRes.emailDomain ?? null)
        setIsGroupLoaded(true)
      } catch {
        if (!cancelled) {
          setGroupError('그룹 정보를 불러오지 못했습니다')
          setGroup(null)
          setRestaurants([])
          setEmailDomain(null)
          setIsGroupLoaded(false)
          navigate('/404', { replace: true })
        }
      } finally {
        if (!cancelled) {
          setIsGroupLoading(false)
        }
      }
    }
    fetchGroup()
    return () => {
      cancelled = true
    }
  }, [groupId, navigate])

  useEffect(() => {
    if (!isValidId(groupId)) return
    if (!isGroupLoaded) return
    if (isLocationLoading) return
    if (!locationPosition) {
      setRestaurants([])
      setRestaurantError(locationError ?? '위치 정보가 필요합니다.')
      return
    }
    let cancelled = false
    const fetchRestaurants = async () => {
      setIsRestaurantsLoading(true)
      setRestaurantError(null)
      try {
        const restaurantRes = await getGroupReviewRestaurants(groupId, {
          latitude: locationPosition.latitude,
          longitude: locationPosition.longitude,
          size: 10,
          categories:
            selectedCategory && selectedCategory !== ALL_CATEGORY ? selectedCategory : undefined,
        })
        if (cancelled) return
        setRestaurants(restaurantRes.items ?? [])
      } catch {
        if (!cancelled) {
          setRestaurantError('음식점 정보를 불러오지 못했습니다')
          setRestaurants([])
        }
      } finally {
        if (!cancelled) {
          setIsRestaurantsLoading(false)
        }
      }
    }
    fetchRestaurants()
    return () => {
      cancelled = true
    }
  }, [groupId, isGroupLoaded, isLocationLoading, locationError, locationPosition, selectedCategory])

  const isJoined =
    isLoaded && isValidId(groupId) ? summaries.some((item) => item.groupId === groupId) : false
  const subgroupCountLabel = hasMoreSubgroups
    ? `${subgroupPreviews.length}+`
    : String(subgroupPreviews.length)
  const joinedSubgroupIdSet = useMemo(() => {
    const ids = new Set<number>()
    for (const summary of summaries) {
      for (const subgroup of summary.subGroups ?? []) {
        ids.add(subgroup.subGroupId)
      }
    }
    return ids
  }, [summaries])

  const closeSubgroupJoinModals = () => {
    setSubgroupJoinConfirmOpen(false)
    setSubgroupPasswordDialogOpen(false)
    setSelectedSubgroup(null)
    setSubgroupPassword('')
  }

  const handleSubgroupJoin = async (password?: string) => {
    if (!selectedSubgroup || !isValidId(groupId)) return

    setIsJoiningSubgroup(true)
    try {
      const trimmedPassword = password?.trim()
      await joinSubgroup(
        groupId,
        selectedSubgroup.subgroupId,
        trimmedPassword ? trimmedPassword : undefined,
      )
      toast.success('하위 그룹에 가입되었습니다')
      await refresh()
      closeSubgroupJoinModals()
      navigate(ROUTES.subgroupDetail(String(selectedSubgroup.subgroupId)))
    } catch (error: unknown) {
      const code = getApiErrorCode(error)
      if (code === 'PASSWORD_MISMATCH') {
        toast.error('비밀번호가 올바르지 않습니다')
      } else if (code === 'SUBGROUP_ALREADY_JOINED') {
        toast.message('이미 가입된 하위 그룹입니다')
        closeSubgroupJoinModals()
        navigate(ROUTES.subgroupDetail(String(selectedSubgroup.subgroupId)))
      } else if (code === 'NO_PERMISSION') {
        toast.error('그룹 가입 후 하위 그룹에 참여할 수 있습니다')
      } else {
        toast.error('하위 그룹 가입에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setIsJoiningSubgroup(false)
    }
  }

  const handleSubgroupPreviewClick = (subgroup: SubgroupListItemDto) => {
    const isSubgroupJoined = joinedSubgroupIdSet.has(subgroup.subgroupId)
    if (isSubgroupJoined) {
      navigate(ROUTES.subgroupDetail(String(subgroup.subgroupId)))
      return
    }

    setSelectedSubgroup(subgroup)
    if (subgroup.joinType === 'PASSWORD') {
      setSubgroupPassword('')
      setSubgroupPasswordDialogOpen(true)
      return
    }
    setSubgroupJoinConfirmOpen(true)
  }

  return (
    <div className="pb-10">
      <GroupDetailHeader
        group={group ?? EMPTY_GROUP}
        isJoined={isJoined || shouldMarkJoined}
        isLoading={isGroupLoading}
        onBack={() => {
          if (isFromOnboardingFlow) {
            navigate(ROUTES.home, { replace: true })
            return
          }
          navigate(-1)
        }}
        onJoin={() => {
          if (!isValidId(groupId)) return
          const targetRoute =
            emailDomain === null
              ? ROUTES.groupPasswordJoin(String(groupId))
              : ROUTES.groupEmailJoin(String(groupId))
          navigate(targetRoute)
        }}
        onMoreAction={() => {
          if (!isValidId(groupId)) return
          navigate(`${ROUTES.subgroupList}?groupId=${groupId}`)
        }}
        onNotificationSettings={() => navigate(ROUTES.notificationSettings)}
        onLeaveGroup={() => setLeaveDialogOpen(true)}
        showJoinGuide={showJoinGuide}
        isJoinGuideVisible={isJoinGuideVisible}
      />

      <div className="h-2 border-y border-border/60 bg-muted/40" aria-hidden />

      <Container className="pt-4 pb-4 border-b border-border">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">하위 그룹</h2>
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2 text-sm font-semibold text-white">
              {subgroupCountLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isValidId(groupId)) return
              navigate(`${ROUTES.subgroupList}?groupId=${groupId}`)
            }}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            전체보기
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-3 text-sm text-muted-foreground">사적인 모임들을 확인하고 참여해보세요</p>

        <div className="space-y-3">
          {isSubgroupPreviewsLoading ? (
            <>
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </>
          ) : subgroupPreviews.length > 0 ? (
            subgroupPreviews.map((subgroup) => (
              <button
                key={subgroup.subgroupId}
                type="button"
                onClick={() => handleSubgroupPreviewClick(subgroup)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left hover:bg-accent/40"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {subgroup.profileImageUrl || subgroup.thumnailImage?.url ? (
                    <img
                      src={subgroup.profileImageUrl ?? subgroup.thumnailImage?.url}
                      alt={subgroup.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      {subgroup.name.slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold">{subgroup.name}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {subgroup.memberCount}명
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              아직 하위 그룹이 없습니다.
            </div>
          )}
        </div>
      </Container>

      <div className="h-2 border-y border-border/60 bg-muted/40" aria-hidden />

      <Container className="pt-3 pb-3 border-b border-border">
        <GroupCategoryFilter
          categories={[
            ALL_CATEGORY,
            ...(categories.length ? categories : CATEGORY_OPTIONS).filter(
              (category) => category !== ALL_CATEGORY,
            ),
          ]}
          value={selectedCategory}
          onChange={(value: string | null) => {
            setSelectedCategory(value ?? ALL_CATEGORY)
          }}
        />
      </Container>

      <Container className="mt-4 space-y-4">
        {isGroupLoading || isRestaurantsLoading || isCategoryLoading || isLocationLoading ? (
          <>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </>
        ) : groupError ? (
          <div className="py-12 text-center text-sm text-muted-foreground">{groupError}</div>
        ) : restaurantError ? (
          <div className="py-12 text-center text-sm text-muted-foreground">{restaurantError}</div>
        ) : (
          restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              reviewSummary={restaurant.reviewSummary}
              onClick={() => navigate(ROUTES.restaurantDetail(String(restaurant.id)))}
            />
          ))
        )}

        {!isGroupLoading &&
          !isRestaurantsLoading &&
          !groupError &&
          !restaurantError &&
          restaurants.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              선택한 카테고리에 해당하는 음식점이 없습니다.
            </div>
          )}
      </Container>

      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <ConfirmAlertDialogContent
          size="sm"
          title="그룹 탈퇴"
          description="그룹 및 해당 그룹의 하위그룹에서 모두 나가게 됩니다. 다시 참가하려면 인증이 필요합니다."
          confirmText="나가기"
          onConfirm={() => {
            if (!isValidId(groupId)) return
            leaveGroup(groupId)
              .then(() => {
                toast.success('그룹에서 탈퇴했습니다')
                refresh()
              })
              .catch(() => {
                toast.error('그룹 탈퇴에 실패했습니다')
              })
              .finally(() => {
                setLeaveDialogOpen(false)
              })
          }}
        />
      </AlertDialog>

      <AlertDialog open={subgroupJoinConfirmOpen} onOpenChange={setSubgroupJoinConfirmOpen}>
        <ConfirmAlertDialogContent
          size="sm"
          title="하위 그룹 가입"
          description={`"${selectedSubgroup?.name ?? ''}"에 가입하시겠습니까?`}
          confirmText="가입하기"
          onConfirm={() => {
            void handleSubgroupJoin()
          }}
          confirmDisabled={isJoiningSubgroup}
        />
      </AlertDialog>

      <Dialog open={subgroupPasswordDialogOpen} onOpenChange={setSubgroupPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>하위 그룹 가입</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-3 text-sm text-muted-foreground">
              "{selectedSubgroup?.name ?? '하위 그룹'}" 가입 비밀번호를 입력해주세요.
            </p>
            <Input
              type="password"
              placeholder="비밀번호 입력"
              value={subgroupPassword}
              onChange={(event) => setSubgroupPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleSubgroupJoin(subgroupPassword)
                }
              }}
              disabled={isJoiningSubgroup}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSubgroupPasswordDialogOpen(false)}
              disabled={isJoiningSubgroup}
            >
              취소
            </Button>
            <Button
              onClick={() => {
                void handleSubgroupJoin(subgroupPassword)
              }}
              disabled={isJoiningSubgroup || !subgroupPassword.trim()}
            >
              가입하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
