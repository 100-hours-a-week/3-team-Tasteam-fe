import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { UserPlus, UserCheck, MoreVertical, MessageSquare, Lock, Bell } from 'lucide-react'
import { useAuth } from '@/entities/user/model/useAuth'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { ProfileImage } from '@/shared/ui/profile-image'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Skeleton } from '@/shared/ui/skeleton'
// import { RestaurantCard } from '@/entities/restaurant/ui'
import { DetailReviewCard } from '@/entities/review/ui'
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

export function SubgroupsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, openLogin } = useAuth()
  const { isSubgroupMember, isLoaded, summaries, refresh } = useMemberGroups()
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [subgroup, setSubgroup] = useState<SubgroupDetailDto | null>(null)
  const [parentGroupName, setParentGroupName] = useState('')
  const [reviews, setReviews] = useState<ReviewListItemDto[]>([])
  const [members, setMembers] = useState<SubgroupMemberDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)
  // const [savedRestaurants, setSavedRestaurants] = useState<Record<string, boolean>>({})

  const subgroupId = id ? Number(id) : null
  const isSubgroupLoading = isLoading || (!subgroup && !error)
  const isMember =
    isAuthenticated &&
    isLoaded &&
    subgroupId !== null &&
    !Number.isNaN(subgroupId) &&
    isSubgroupMember(subgroupId)
  const memberCount =
    subgroup && typeof subgroup.memberCount === 'number' ? subgroup.memberCount : 1
  // const restaurants: Array<{
  //   id: string
  //   name: string
  //   category: string
  //   rating: number
  //   distance: string
  //   image: string
  //   tags: string[]
  // }> = []

  const handleChatClick = () => {
    if (!id) return
    if (!isAuthenticated) {
      openLogin()
      return
    }
    navigate(ROUTES.chatRoom(id))
  }

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
          setSubgroup(null)
          setParentGroupName('')
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
    if (!subgroup?.groupId || !isLoaded) return
    const matchedGroup = summaries.find((item) => item.groupId === subgroup.groupId)
    if (matchedGroup) {
      setParentGroupName(matchedGroup.groupName)
    }
  }, [subgroup?.groupId, isLoaded, summaries])

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
      if (!subgroup?.groupId) return
      await joinSubgroup(subgroup.groupId, Number(id), password)

      alert('가입되었습니다!')
      refresh()
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
      refresh()
      navigate(ROUTES.groups, { replace: true })
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

  const handleGroupNameClick = () => {
    if (subgroup?.groupId) {
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
        {/* Parent Group Badge: 그룹명 > 하위그룹명 (각각 말줄임, 그룹명만 클릭 가능) */}
        <div className="flex items-center gap-1 mb-3 min-w-0 overflow-hidden">
          {isSubgroupLoading ? (
            <>
              <Skeleton className="h-4 w-20 shrink-0" />
              <span className="mx-0.5 text-muted-foreground/50">&gt;</span>
              <Skeleton className="h-4 w-24 shrink-0" />
            </>
          ) : (
            <>
              <button
                onClick={handleGroupNameClick}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate min-w-0 max-w-[40%] text-left"
                disabled={!parentGroupName}
                title={parentGroupName || '그룹'}
              >
                {parentGroupName || '그룹'}
              </button>
              <span className="mx-0.5 text-muted-foreground/50 flex-shrink-0">&gt;</span>
              <span
                className="text-sm font-medium text-foreground truncate min-w-0 flex-1 block"
                title={subgroup?.name || '하위 그룹'}
              >
                {subgroup?.name || '하위 그룹'}
              </span>
            </>
          )}
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {isSubgroupLoading ? (
                <Skeleton className="h-14 w-14 rounded-full shrink-0" />
              ) : (
                <Avatar className="h-14 w-14 shrink-0 border border-border">
                  <AvatarImage
                    src={subgroup?.profileImageUrl ?? subgroup?.thumnailImage?.url}
                    alt={subgroup?.name ?? '하위 그룹'}
                  />
                  <AvatarFallback>{(subgroup?.name ?? '하위').slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 min-w-0 overflow-hidden">
                {isSubgroupLoading ? (
                  <>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </>
                ) : (
                  <>
                    <h1
                      className="text-xl font-bold mb-2 truncate"
                      title={subgroup?.name || '하위 그룹'}
                    >
                      {subgroup?.name || '하위 그룹'}
                    </h1>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {subgroup?.description || '설명이 없습니다.'}
                    </p>
                  </>
                )}
              </div>
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
                {isSubgroupLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <Skeleton
                        key={`member-skeleton-${idx}`}
                        className="h-8 w-8 rounded-full border-2 border-background"
                      />
                    ))
                  : members.length > 0
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
                    : Array.from({
                        length: Math.min(5, memberCount),
                      }).map((_, idx) => (
                        <Avatar
                          key={`member-${idx}`}
                          className="h-8 w-8 border-2 border-background"
                        >
                          <AvatarFallback className="text-xs">멤버</AvatarFallback>
                        </Avatar>
                      ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {isSubgroupLoading ? '멤버 수 불러오는 중' : `${memberCount}명 참여 중`}
              </span>
            </div>
            <div />
          </div>
        </Card>
      </Container>

      {/* 리뷰 목록 */}
      <Container className="mt-4 space-y-4">
        <div className="space-y-3">
          {isSubgroupLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : error ? (
            <div className="text-center py-12 text-muted-foreground">{error}</div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <DetailReviewCard key={review.id} variant="group" review={review} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">등록된 리뷰가 없습니다.</div>
          )}
        </div>
      </Container>

      {FEATURE_FLAGS.enableChat && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-4 h-14 w-14 rounded-full shadow-xl z-40 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
          onClick={handleChatClick}
          aria-label="채팅하기"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

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
