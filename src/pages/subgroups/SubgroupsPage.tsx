import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { UserPlus, UserCheck, MoreVertical, MessageSquare, Lock, Bell } from 'lucide-react'
import { useAuth } from '@/entities/user/model/useAuth'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ProfileImage } from '@/shared/ui/profile-image'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
// import { RestaurantCard } from '@/entities/restaurant/ui'
import { ReviewCard } from '@/entities/review/ui'
import {
  getSubgroup,
  getSubgroupMembers,
  getSubgroupReviews,
  joinSubgroup,
  leaveSubgroup,
} from '@/entities/subgroup/api/subgroupApi'
import { getGroup } from '@/entities/group/api/groupApi'
import { useMemberGroups } from '@/entities/member/model/useMemberGroups'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { ROUTES } from '@/shared/config/routes'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'
import type { SubgroupDetailDto, SubgroupMemberDto } from '@/entities/subgroup/model/dto'
import type { ReviewListItemDto } from '@/entities/review/model/dto'
import type { ErrorResponse } from '@/shared/types/api'

const EMPTY_SUBGROUP: SubgroupDetailDto = {
  groupId: 0,
  subgroupId: 0,
  name: '하위 그룹 불러오는 중...',
  description: '',
  memberCount: 0,
  thumnailImage: undefined,
  createdAt: new Date().toISOString(),
}

export function SubgroupsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, openLogin } = useAuth()
  const { isSubgroupMember, isLoaded, summaries } = useMemberGroups()
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [subgroup, setSubgroup] = useState<SubgroupDetailDto>(EMPTY_SUBGROUP)
  const [parentGroupName, setParentGroupName] = useState('그룹')
  const [reviews, setReviews] = useState<ReviewListItemDto[]>([])
  const [members, setMembers] = useState<SubgroupMemberDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)
  // const [savedRestaurants, setSavedRestaurants] = useState<Record<string, boolean>>({})

  const subgroupId = id ? Number(id) : null
  const isMember =
    isAuthenticated &&
    isLoaded &&
    subgroupId !== null &&
    !Number.isNaN(subgroupId) &&
    isSubgroupMember(subgroupId)
  // const restaurants: Array<{
  //   id: string
  //   name: string
  //   category: string
  //   rating: number
  //   distance: string
  //   image: string
  //   tags: string[]
  // }> = []

  useEffect(() => {
    if (!subgroupId || Number.isNaN(subgroupId)) return
    let cancelled = false
    const fetchSubgroup = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const detail = await getSubgroup(subgroupId)
        if (cancelled) return
        setSubgroup(detail)
        const matchedGroup = summaries.find((item) => item.groupId === detail.groupId)
        if (!cancelled && matchedGroup) {
          setParentGroupName(matchedGroup.groupName)
        }
        if (!cancelled && !matchedGroup) {
          try {
            const groupRes = await getGroup(detail.groupId)
            if (!cancelled) {
              setParentGroupName(groupRes.name)
            }
          } catch {
            if (!cancelled) {
              setParentGroupName('그룹')
            }
          }
        }
        try {
          const memberList = await getSubgroupMembers(detail.subgroupId, { size: 5 })
          if (!cancelled) {
            setMembers(memberList)
          }
        } catch {
          if (!cancelled) {
            setMembers([])
          }
        }
        try {
          const reviewRes = await getSubgroupReviews(subgroupId, { size: 10 })
          if (!cancelled) {
            setReviews(reviewRes.items ?? [])
          }
        } catch {
          if (!cancelled) {
            setReviews([])
          }
        }
      } catch {
        if (!cancelled) {
          setSubgroup(EMPTY_SUBGROUP)
          setParentGroupName('그룹')
          setReviews([])
          setMembers([])
          setError('하위 그룹 정보를 불러오지 못했습니다')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    fetchSubgroup()
    return () => {
      cancelled = true
    }
  }, [subgroupId, summaries])

  useEffect(() => {
    if (!subgroup.groupId || !isLoaded) return
    const matchedGroup = summaries.find((item) => item.groupId === subgroup.groupId)
    if (matchedGroup) {
      setParentGroupName(matchedGroup.groupName)
    }
  }, [subgroup.groupId, isLoaded, summaries])

  // const handleSaveToggle = (restaurantId: string) => {
  //   setSavedRestaurants((prev) => ({
  //     ...prev,
  //     [restaurantId]: !prev[restaurantId],
  //   }))
  // }

  const handleInvite = () => {
    if (!isAuthenticated) {
      openLogin()
      return
    }
    setIsJoinDialogOpen(true)
  }

  const handleJoinSubmit = async () => {
    if (!id) return
    if (!isAuthenticated) {
      openLogin()
      return
    }

    try {
      if (!subgroup.groupId) return
      await joinSubgroup(subgroup.groupId, Number(id), password)

      alert('가입되었습니다!')
      setIsJoinDialogOpen(false)
      setPassword('')
      // 필요한 경우 페이지 새로고침 또는 상태 업데이트 로직 추가 가능
    } catch (error: unknown) {
      const code = axios.isAxiosError<ErrorResponse>(error) ? error.response?.data?.code : undefined
      if (code === 'PASSWORD_MISMATCH') {
        alert('가입에 실패했습니다. 비밀번호를 확인해주세요.')
      } else if (code === 'SUBGROUP_ALREADY_JOINED') {
        alert('이미 가입된 하위그룹입니다.')
      } else if (code === 'AUTHENTICATION_REQUIRED') {
        alert('로그인이 필요합니다.')
      } else if (code === 'NO_PERMISSION') {
        alert('그룹 멤버만 하위그룹에 가입할 수 있습니다.')
      } else if (code === 'GROUP_NOT_FOUND' || code === 'SUBGROUP_NOT_FOUND') {
        alert('하위그룹 정보를 찾을 수 없습니다.')
      } else {
        alert('가입에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  }

  const handleLeaveSubGroup = async () => {
    if (!subgroupId || Number.isNaN(subgroupId)) return
    if (!isAuthenticated) {
      openLogin()
      return
    }
    setIsLeaving(true)
    try {
      await leaveSubgroup(subgroupId)
      alert('하위 그룹에서 나왔습니다.')
      navigate(-1)
    } catch (error: unknown) {
      const code = axios.isAxiosError<ErrorResponse>(error) ? error.response?.data?.code : undefined
      if (code === 'AUTHENTICATION_REQUIRED') {
        alert('로그인이 필요합니다.')
      } else if (code === 'NO_PERMISSION') {
        alert('이미 탈퇴했거나 권한이 없습니다.')
      } else if (code === 'SUBGROUP_NOT_FOUND') {
        alert('하위그룹 정보를 찾을 수 없습니다.')
      } else {
        alert('탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setIsLeaving(false)
    }
  }

  const handleChatClick = () => {
    if (!id) return
    if (!isAuthenticated) {
      openLogin()
      return
    }
    navigate(ROUTES.chatRoom(id))
  }

  const handleGroupNameClick = () => {
    if (subgroup.groupId) {
      navigate(ROUTES.groupDetail(String(subgroup.groupId)))
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar
        showBackButton
        onBack={() => navigate(-1)}
        title="하위 그룹 상세"
        actions={
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleInvite}
              disabled={isMember}
              aria-label={isMember ? '이미 가입된 하위 그룹' : '하위 그룹 가입'}
            >
              {isMember ? <UserCheck className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </Button>
            {FEATURE_FLAGS.enableNotifications && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(ROUTES.notificationSettings)}
                aria-label="알림 설정"
              >
                <Bell className="h-5 w-5" />
              </Button>
            )}
          </>
        }
      />

      {/* SubGroup Header */}
      <Container className="pt-4 pb-6">
        {/* Parent Group Badge */}
        <div className="flex items-center gap-1 mb-3">
          <button
            onClick={handleGroupNameClick}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {parentGroupName}
          </button>
          <span className="mx-0.5 text-muted-foreground/50">&gt;</span>
          <span className="text-sm font-medium text-foreground">{subgroup.name}</span>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold mb-2">{subgroup.name}</h1>
              <p className="text-sm text-muted-foreground mb-3">{subgroup.description}</p>
            </div>
            {isMember && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* 하위 그룹 정보 수정은 아직 숨김 */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        하위 그룹 나가기
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogTitle>하위 그룹을 나가시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          하위 그룹을 나가면 이 하위 그룹의 모든 정보와 활동 내역을 볼 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          variant="default"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={handleLeaveSubGroup}
                          disabled={isLeaving}
                        >
                          나가기
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {members.length > 0
                  ? members
                      .slice(0, 5)
                      .map((member) => (
                        <ProfileImage
                          key={member.memberId}
                          image={member.profileImage}
                          name={member.nickname}
                          size="sm"
                          className="h-8 w-8 border-2 border-background"
                        />
                      ))
                  : Array.from({ length: Math.min(5, subgroup.memberCount || 0) }).map((_, idx) => (
                      <Avatar key={`member-${idx}`} className="h-8 w-8 border-2 border-background">
                        <AvatarFallback className="text-xs">멤버</AvatarFallback>
                      </Avatar>
                    ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {subgroup.memberCount}명 참여 중
              </span>
            </div>
            <div />
          </div>
        </Card>
      </Container>

      {/* Tabs */}
      <Tabs defaultValue="restaurants" className="w-full">
        <Container>
          <TabsList className="w-full grid grid-cols-1">
            {/* V2에서 맛집 탭 추가 */}
            {/* <TabsTrigger value="restaurants">맛집</TabsTrigger> */}
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
          </TabsList>
        </Container>

        {/* V2에서 맛집 탭 추가 */}
        {/* <TabsContent value="restaurants" className="mt-4">
          <Container className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">하위 그룹 맛집 리스트</h3>
            </div>
            <div className="grid gap-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  맛집 정보를 불러오는 중...
                </div>
              ) : restaurants.length > 0 ? (
                restaurants.map((restaurant: any) => (
                  <RestaurantCard
                    key={restaurant.id}
                    {...restaurant}
                    // isSaved={savedRestaurants[restaurant.id]}
                    // onSave={() => handleSaveToggle(restaurant.id)}
                    onClick={() => navigate(ROUTES.restaurantDetail(restaurant.id))}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  등록된 맛집이 없습니다.
                </div>
              )}
            </div>
          </Container>
        </TabsContent> */}

        <TabsContent value="reviews" className="mt-4">
          <Container className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">하위 그룹 리뷰</h3>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  리뷰를 불러오는 중입니다.
                </div>
              ) : error ? (
                <div className="text-center py-12 text-muted-foreground">{error}</div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  등록된 리뷰가 없습니다.
                </div>
              )}
            </div>
          </Container>
        </TabsContent>
      </Tabs>

      {/* Floating Chat Button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-4 h-14 w-14 rounded-full shadow-xl z-40 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
        onClick={handleChatClick}
        aria-label="채팅하기"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Join Password Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>하위 그룹 가입하기</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="비밀번호 입력"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleJoinSubmit()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="flex-1" onClick={() => setIsJoinDialogOpen(false)}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleJoinSubmit}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
