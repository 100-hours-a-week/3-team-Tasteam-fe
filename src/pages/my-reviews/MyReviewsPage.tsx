import { useState } from 'react'
import { FileText, Star, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { EmptyState } from '@/widgets/empty-state'
import { Card, CardContent } from '@/shared/ui/card'
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
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      restaurantName: '한옥마을 순두부',
      rating: 5,
      content:
        '정말 맛있어요! 순두부찌개가 부드럽고 깊은 맛이 납니다. 반찬도 맛있고 분위기도 좋아요.',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      restaurantName: '우동 카덴',
      rating: 4,
      content: '면발이 쫄깃하고 국물이 진해요. 다만 양이 조금 적은 편입니다.',
      createdAt: '2024-01-10',
    },
    {
      id: '3',
      restaurantName: '브런치 카페',
      rating: 5,
      content: '에그 베네딕트가 정말 맛있어요. 커피도 맛있고 분위기가 좋습니다.',
      createdAt: '2024-01-05',
    },
  ])
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

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
              <Card key={review.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <button
                      className="text-left"
                      onClick={() => onRestaurantClick?.(review.restaurantName)}
                    >
                      <h3 className="font-semibold">{review.restaurantName}</h3>
                    </button>
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

                  <div className="flex items-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">{review.rating}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">{review.content}</p>

                  <p className="text-xs text-muted-foreground mt-2">{review.createdAt}</p>
                </CardContent>
              </Card>
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
