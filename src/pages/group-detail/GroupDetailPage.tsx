import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
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
import { useMemberGroups } from '@/entities/member'
import { getCurrentPosition, type GeoPosition } from '@/shared/lib/geolocation'
import { isValidId, parseNumberParam } from '@/shared/lib/number'
import { Skeleton } from '@/shared/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'

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
              reviewSummary={restaurant.reviewSummary ?? '리뷰 요약을 준비 중입니다.'}
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
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>그룹 탈퇴</AlertDialogTitle>
            <AlertDialogDescription>
              그룹 및 해당 그룹의 하위그룹에서 모두 나가게 됩니다. 다시 참가하려면 인증이
              필요합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
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
            >
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
