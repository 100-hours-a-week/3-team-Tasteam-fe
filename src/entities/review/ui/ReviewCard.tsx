import { ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import type { ReviewListItemDto, ReviewDetailDto } from '../model/dto'

type ReviewDtoProps = {
  review: ReviewListItemDto | ReviewDetailDto
  className?: string
}

type ReviewSimpleProps = {
  id: string
  userName: string
  userAvatar?: string
  rating?: number
  date: string
  content: string
  images?: string[]
  className?: string
}

type ReviewCardProps = ReviewDtoProps | ReviewSimpleProps

function isSimpleProps(props: ReviewCardProps): props is ReviewSimpleProps {
  return 'userName' in props && !('review' in props)
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getImages(review: ReviewListItemDto | ReviewDetailDto): string[] {
  if ('images' in review) {
    return review.images.map((img) => img.url)
  }
  return review.thumbnailImage ? [review.thumbnailImage.url] : []
}

function getContent(review: ReviewListItemDto | ReviewDetailDto): string {
  if ('content' in review) {
    return review.content
  }
  return review.contentPreview
}

export function ReviewCard(props: ReviewCardProps) {
  if (isSimpleProps(props)) {
    const { userName, userAvatar, rating, date, content, images, className } = props
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10">
            {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
            <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="truncate">{userName}</h4>
              <span className="text-xs text-muted-foreground shrink-0">{date}</span>
            </div>
            {rating !== undefined && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(
                      'h-3 w-3',
                      idx < rating ? 'fill-primary text-primary' : 'text-muted-foreground',
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-sm leading-relaxed mb-3">{content}</p>
        {images && images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((image, idx) => (
              <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                <img
                  src={image}
                  alt={`리뷰 이미지 ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    )
  }

  const { review, className } = props
  const images = getImages(review)

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{review.author.nickname.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="truncate">{review.author.nickname}</h4>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDate(review.createdAt)}
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
      <p className="text-sm leading-relaxed mb-3">{getContent(review)}</p>
      {review.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {review.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((image, idx) => (
            <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
              <img
                src={image}
                alt={`리뷰 이미지 ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
