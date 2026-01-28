import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Container } from '@/widgets/container'
import { ROUTES } from '@/shared/config/routes'
import {
  GroupCategoryFilter,
  GroupDetailHeader,
  type GroupDetailHeaderData,
} from '@/features/groups'
import { ReviewCard } from '@/entities/review/ui'
import { getGroup, getGroupReviews, leaveGroup } from '@/entities/group/api/groupApi'
import type { ReviewListItemDto } from '@/entities/review/model/dto'
import { useMemberGroups } from '@/entities/member/model/useMemberGroups'
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

const EMPTY_GROUP: GroupDetailHeaderData = {
  name: '그룹 불러오는 중...',
  addressLine: '',
  memberCount: 0,
}

export function GroupDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [group, setGroup] = useState<GroupDetailHeaderData>(EMPTY_GROUP)
  const [reviews, setReviews] = useState<ReviewListItemDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const groupId = id ? Number(id) : null
  const { summaries, isLoaded } = useMemberGroups()

  const joinedState =
    location.state && typeof location.state === 'object'
      ? (location.state as { joined?: boolean })
      : undefined

  const shouldMarkJoined = Boolean(joinedState?.joined)

  useEffect(() => {
    if (!shouldMarkJoined) return

    toast.success('그룹 가입이 완료되었습니다')
    navigate(location.pathname, { replace: true })
  }, [navigate, location.pathname, shouldMarkJoined])

  useEffect(() => {
    if (!groupId || Number.isNaN(groupId)) return
    let cancelled = false
    const fetchGroup = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [groupRes, reviewRes] = await Promise.all([
          getGroup(groupId),
          getGroupReviews(groupId, { size: 10 }),
        ])
        if (cancelled) return
        setGroup({
          name: groupRes.name,
          profileImage: groupRes.logoImageUrl ?? undefined,
          addressLine: groupRes.address,
          addressDetail: groupRes.detailAddress ?? undefined,
          memberCount: 0,
        })
        setReviews(
          (reviewRes.items ?? []).map((item) => ({
            id: item.id,
            author: item.author,
            contentPreview: item.contentPreview,
            isRecommended: item.isRecommended,
            keywords: item.keywords,
            thumbnailImage: item.thumbnailImage,
            createdAt: item.createdAt,
          })),
        )
      } catch {
        if (!cancelled) {
          setError('그룹 정보를 불러오지 못했습니다')
          setGroup(EMPTY_GROUP)
          setReviews([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    fetchGroup()
    return () => {
      cancelled = true
    }
  }, [groupId])

  const isJoined =
    isLoaded && groupId !== null && !Number.isNaN(groupId)
      ? summaries.some((item) => item.groupId === groupId)
      : false

  const filteredReviews = useMemo(() => {
    if (!selectedCategory) return reviews
    return reviews.filter((review) => review.keywords.includes(selectedCategory))
  }, [selectedCategory, reviews])

  return (
    <div className="pb-10">
      <GroupDetailHeader
        group={group}
        isJoined={isJoined || shouldMarkJoined}
        onBack={() => navigate(-1)}
        onJoin={() => groupId && navigate(ROUTES.groupPasswordJoin(String(groupId)))}
        onMoreAction={() => navigate(ROUTES.subgroupList)}
        onNotificationSettings={() => navigate(ROUTES.notificationSettings)}
        onLeaveGroup={() => setLeaveDialogOpen(true)}
      />

      <Container className="pt-3 pb-3 border-b border-border">
        <GroupCategoryFilter
          categories={CATEGORY_OPTIONS}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </Container>

      <Container className="mt-4 space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            그룹 정보를 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-muted-foreground">{error}</div>
        ) : (
          filteredReviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}

        {!isLoading && !error && filteredReviews.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            선택한 카테고리에 해당하는 리뷰가 없습니다.
          </div>
        )}

        <div className="py-4 text-center text-xs text-muted-foreground">
          스크롤하면 다음 리뷰를 불러옵니다.
        </div>
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
                if (!groupId || Number.isNaN(groupId)) return
                leaveGroup(groupId)
                  .then(() => {
                    toast.success('그룹에서 탈퇴했습니다')
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
