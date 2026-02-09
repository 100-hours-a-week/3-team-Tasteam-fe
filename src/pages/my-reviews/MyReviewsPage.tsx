import { useState, useEffect } from 'react'
import { FileText, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { getMyReviews } from '@/entities/member/api/memberApi'
import { SimpleReviewCard } from '@/entities/review/ui'

type Review = {
  id: string
  restaurantName: string
  rating: number
  content: string
  createdAt: string
  imageUrls?: string[]
}

type MyReviewsPageProps = {
  onEditReview?: (id: string) => void
  onRestaurantClick?: (name: string) => void
  onBack?: () => void
}

export function MyReviewsPage({ onEditReview, onRestaurantClick, onBack }: MyReviewsPageProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  useEffect(() => {
    getMyReviews()
      .then((response) => {
        const rawItems =
          response.data?.items ??
          (
            response.data as {
              data?: {
                items?: Array<{ id: number; restaurantName: string; reviewContent: string }>
              }
            }
          )?.data?.items ??
          []
        const apiData = rawItems.map((item) => ({
          id: String((item as { id: number }).id),
          restaurantName: (item as { restaurantName: string }).restaurantName,
          rating: 5,
          content: (item as { reviewContent: string }).reviewContent,
          createdAt: '',
        }))
        setReviews(apiData)
      })
      .catch(() => setReviews([]))
  }, [])

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
    toast.success('리뷰가 삭제되었습니다')
    setDeleteTargetId(null)
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="내 리뷰" showBackButton onBack={onBack} />

      <Container className="flex-1 py-4 overflow-auto">
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="relative">
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
                      <DropdownMenuItem onClick={() => onEditReview?.(review.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTargetId(review.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>삭제된 리뷰는 복구할 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteTargetId && handleDelete(deleteTargetId)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
