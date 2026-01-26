import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { ReviewCard } from '@/entities/review/ui'
import { getRestaurantReviews } from '@/entities/review/api/reviewApi'
import type { ReviewListItemDto } from '@/entities/review/model/dto'

// ReviewListItemDto 형식에 맞춘 목업 데이터
const mockReviews: ReviewListItemDto[] = [
  {
    id: 1,
    author: { nickname: '김철수' },
    contentPreview:
      '정말 신선하고 맛있었어요! 셰프님도 친절하시고 분위기도 좋았습니다. 다음에 또 방문하고 싶네요.',
    isRecommended: true,
    keywords: ['맛있어요', '친절해요'],
    thumbnailImage: {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    },
    createdAt: '2024-01-20T12:00:00Z',
  },
  {
    id: 2,
    author: { nickname: '이영희' },
    contentPreview: '런치 세트가 가성비가 좋아요. 점심 시간에는 웨이팅이 있으니 예약 추천합니다.',
    isRecommended: true,
    keywords: ['가성비', '예약필수'],
    thumbnailImage: null,
    createdAt: '2024-01-18T12:00:00Z',
  },
  {
    id: 3,
    author: { nickname: '박민수' },
    contentPreview: '오마카세 B 코스를 먹었는데 정말 훌륭했습니다. 특히 참치가 일품이었어요!',
    isRecommended: true,
    keywords: ['오마카세', '참치맛집'],
    thumbnailImage: {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400',
    },
    createdAt: '2024-01-15T12:00:00Z',
  },
]

export function RestaurantReviewsPage() {
  const { id: restaurantId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [reviews, setReviews] = useState<ReviewListItemDto[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const observer = useRef<IntersectionObserver | null>(null)

  const fetchReviews = useCallback(async () => {
    if (!restaurantId || isLoading || !hasNextPage) return

    setIsLoading(true)

    const handleMockFallback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setReviews((prev) => {
        const newItems = mockReviews.map((review) => ({
          ...review,
          id: review.id + prev.length, // 고유 ID 생성
        }))

        if (prev.length + newItems.length >= 30) {
          setHasNextPage(false)
        }

        return [...prev, ...newItems]
      })
      setIsInitialLoading(false)
    }

    try {
      const response = await getRestaurantReviews(Number(restaurantId), {
        cursor: nextCursor || undefined,
        size: 10,
      })

      if (response && 'items' in response && response.items.length > 0) {
        const { items, pagination } = response
        setReviews((prev) => [...prev, ...items])
        setNextCursor(pagination.nextCursor)
        setHasNextPage(pagination.hasNext)
      } else {
        // API는 성공했으나 데이터가 없는 경우 목업 사용
        await handleMockFallback()
      }
    } catch (error) {
      // API 호출 실패 시 목업 사용
      await handleMockFallback()
    } finally {
      setIsLoading(false)
      setIsInitialLoading(false)
    }
  }, [restaurantId, isLoading, hasNextPage, nextCursor])

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasNextPage) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchReviews()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasNextPage, fetchReviews],
  )

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return (
    <div className="min-h-screen bg-background pb-10">
      <TopAppBar title="리뷰 전체보기" showBackButton onBack={() => navigate(-1)} />

      <Container className="pt-4">
        {isInitialLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id} ref={index === reviews.length - 1 ? lastElementRef : null}>
                <ReviewCard review={review} />
              </div>
            ))}

            {isLoading && !isInitialLoading && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {!hasNextPage && reviews.length > 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">마지막 리뷰입니다.</p>
            )}

            {!isLoading && reviews.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p>등록된 리뷰가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}
