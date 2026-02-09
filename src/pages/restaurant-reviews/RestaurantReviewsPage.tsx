import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { SimpleReviewCard } from '@/entities/review/ui'
import { getRestaurantReviews } from '@/entities/review/api/reviewApi'
import type { ReviewListItemDto } from '@/entities/review/model/dto'

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

    try {
      const response = await getRestaurantReviews(Number(restaurantId), {
        cursor: nextCursor || undefined,
        size: 10,
      })
      if (response.items && response.items.length > 0 && response.pagination) {
        setReviews((prev) => [...prev, ...response.items])
        setNextCursor(response.pagination.nextCursor)
        setHasNextPage(response.pagination.hasNext)
      } else {
        setHasNextPage(false)
      }
    } catch {
      setHasNextPage(false)
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
                <SimpleReviewCard variant="restaurant" review={review} />
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
