import { useState, useEffect, useRef, useCallback } from 'react'
import { FileText, Loader2, MoreVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/widgets/empty-state'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { AlertDialog } from '@/shared/ui/alert-dialog'
import { ConfirmAlertDialogContent } from '@/shared/ui/confirm-alert-dialog'
import { getMyReviews } from '@/entities/member'
import { deleteReview } from '@/entities/review'
import { SimpleReviewCard } from '@/entities/review'

type Review = {
  id: string
  restaurantName: string
  rating: number
  content: string
  createdAt: string
  imageUrls?: string[]
}

type MyReviewsPageProps = {
  onRestaurantClick?: (name: string) => void
  onBack?: () => void
}

export function MyReviewsPage({ onRestaurantClick, onBack }: MyReviewsPageProps) {
  const qc = useQueryClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const fetchReviews = useCallback(async (cursor?: string) => {
    try {
      const response = await getMyReviews({ cursor, size: 10 })
      const payload =
        response.data?.items != null
          ? response.data
          : (
              response.data as {
                data?: {
                  items?: Array<{
                    id: number
                    restaurantName: string
                    reviewContent: string
                    createdAt?: string
                  }>
                  pagination?: {
                    nextCursor: string | null
                    hasNext: boolean
                  }
                }
              }
            )?.data

      const rawItems = payload?.items ?? []
      const mapped = rawItems.map((item) => ({
        id: String((item as { id: number }).id),
        restaurantName: (item as { restaurantName: string }).restaurantName,
        rating: 5,
        content: (item as { reviewContent: string }).reviewContent,
        createdAt: (item as { createdAt?: string }).createdAt ?? '',
      }))

      setReviews((prev) => (cursor ? [...prev, ...mapped] : mapped))
      setNextCursor(payload?.pagination?.nextCursor ?? null)
      setHasNextPage(Boolean(payload?.pagination?.hasNext))
    } catch {
      if (!cursor) {
        setReviews([])
      }
      setHasNextPage(false)
    } finally {
      if (!cursor) {
        setIsInitialLoading(false)
      } else {
        setIsLoadingMore(false)
      }
    }
  }, [])

  useEffect(() => {
    void fetchReviews()
  }, [fetchReviews])

  const loadMore = useCallback(() => {
    if (isInitialLoading || isLoadingMore || !hasNextPage) return
    setIsLoadingMore(true)
    void fetchReviews(nextCursor ?? undefined)
  }, [fetchReviews, hasNextPage, isInitialLoading, isLoadingMore, nextCursor])

  const lastReviewRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (!node || isInitialLoading || isLoadingMore || !hasNextPage) return

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      })
      observerRef.current.observe(node)
    },
    [hasNextPage, isInitialLoading, isLoadingMore, loadMore],
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(Number(id))
      setReviews((prev) => prev.filter((r) => r.id !== id))
      void qc.invalidateQueries({ queryKey: ['review', 'restaurant'] })
      toast.success('리뷰가 삭제되었습니다')
    } catch {
      toast.error('리뷰 삭제에 실패했습니다')
    } finally {
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="내 리뷰" showBackButton onBack={onBack} />

      <Container className="flex-1 py-4 overflow-auto">
        {isInitialLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="relative"
                ref={index === reviews.length - 1 ? lastReviewRef : undefined}
              >
                <button
                  className="text-left w-full"
                  onClick={() => onRestaurantClick?.(review.restaurantName)}
                >
                  <SimpleReviewCard
                    variant="me"
                    id={review.id}
                    restaurantName={review.restaurantName}
                    date={review.createdAt}
                    content={review.content}
                    images={review.imageUrls}
                    className="pr-10"
                  />
                </button>
                <div className="absolute top-3 right-3 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        variant="destructive"
                        className="gap-1.5"
                        onClick={() => setDeleteTargetId(review.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="작성한 리뷰가 없어요"
            description="맛집에 대한 리뷰를 작성해보세요"
          />
        )}
      </Container>

      <AlertDialog open={!!deleteTargetId} onOpenChange={() => setDeleteTargetId(null)}>
        <ConfirmAlertDialogContent
          title="리뷰를 삭제하시겠습니까?"
          description="삭제된 리뷰는 복구할 수 없습니다."
          confirmText="삭제"
          confirmVariant="destructive"
          onConfirm={() => deleteTargetId && handleDelete(deleteTargetId)}
        />
      </AlertDialog>
    </div>
  )
}
