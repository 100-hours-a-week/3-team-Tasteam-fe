import { ThumbsUp, ThumbsDown, Image as ImageIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import type { ReviewListItemDto, ReviewDetailDto } from '../model/dto'

export type SimpleReviewCardVariant = 'restaurant' | 'me'

/** variant="restaurant" 시 review 기반 */
export type SimpleReviewCardRestaurantProps = {
  variant: 'restaurant'
  review: ReviewListItemDto | ReviewDetailDto
  className?: string
}

/** variant="me" 시 간단 필드 (작성자 없음) */
export type SimpleReviewCardMeProps = {
  variant: 'me'
  id: string
  restaurantName: string
  date: string
  content: string
  images?: string[]
  className?: string
}

export type SimpleReviewCardProps = SimpleReviewCardRestaurantProps | SimpleReviewCardMeProps

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getContent(review: ReviewListItemDto | ReviewDetailDto): string {
  if ('content' in review) {
    return review.content
  }
  return review.contentPreview
}

function hasImages(review: ReviewListItemDto | ReviewDetailDto): boolean {
  if ('images' in review && Array.isArray(review.images) && review.images.length > 0) return true
  if ('thumbnailImage' in review && review.thumbnailImage) return true
  if (
    'thumbnailImages' in review &&
    Array.isArray((review as { thumbnailImages?: unknown[] }).thumbnailImages) &&
    (review as { thumbnailImages: unknown[] }).thumbnailImages.length > 0
  )
    return true
  return false
}

export function SimpleReviewCard(props: SimpleReviewCardProps) {
  if (props.variant === 'me') {
    const { restaurantName, date, content, images, className } = props
    const hasImagesFlag = images != null && images.length > 0
    return (
      <Card className={cn('p-4 gap-0', className)}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h4 className="truncate text-sm font-medium">{restaurantName}</h4>
          <span className="flex items-center gap-1.5 shrink-0">
            {hasImagesFlag && (
              <ImageIcon className="h-4 w-4 text-muted-foreground" aria-label="사진 있음" />
            )}
            <span className="text-xs text-muted-foreground">{date}</span>
          </span>
        </div>
        <p
          className="text-sm leading-relaxed line-clamp-2 text-muted-foreground whitespace-pre-wrap break-words"
          title={content}
        >
          {content}
        </p>
      </Card>
    )
  }

  const { review, className } = props
  const content = getContent(review)
  const hasImagesFlag = hasImages(review)

  return (
    <Card className={cn('p-4 gap-0', className)}>
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{review.author.nickname.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="truncate">{review.author.nickname}</h4>
            <span className="flex items-center gap-1.5 shrink-0">
              {hasImagesFlag && (
                <ImageIcon className="h-4 w-4 text-muted-foreground" aria-label="사진 있음" />
              )}
              <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            {review.isRecommended ? (
              <ThumbsUp className="h-4 w-4 fill-primary text-primary" />
            ) : (
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {review.isRecommended ? '추천' : '비추천'}
            </span>
          </div>
        </div>
      </div>
      <p
        className="text-sm leading-relaxed line-clamp-2 text-muted-foreground mb-2 whitespace-pre-wrap break-words"
        title={content}
      >
        {content}
      </p>
      {(review.keywords?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1">
          {(review.keywords ?? []).map((keyword) => (
            <Badge key={keyword} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  )
}
