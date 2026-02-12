import { Image as ImageIcon, MessageSquare } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'

export type GroupReviewCardItem = {
  id: string
  restaurantId: string
  restaurantName: string
  category: string
  distance: string
  priceRange: string
  totalReviews: number
  images: string[]
  tagLine: string
  summary: string
  author: string
  createdAt: string
  isRecommended?: boolean
}

type GroupReviewCardProps = {
  review: GroupReviewCardItem
  onClick?: (restaurantId: string) => void
  className?: string
}

export function GroupReviewCard({ review, onClick, className }: GroupReviewCardProps) {
  const images = review.images.slice(0, 3)
  const imageSlots = Array.from({ length: 3 }, (_, index) => images[index])

  return (
    <Card className={cn('overflow-hidden border border-border p-0 gap-0', className)}>
      <button
        type="button"
        onClick={() => onClick?.(review.restaurantId)}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative">
          <div className={cn('grid gap-px bg-border', 'grid-cols-3')}>
            {imageSlots.map((src, index) => (
              <div key={`${review.id}-img-${index}`} className="relative bg-muted aspect-square">
                {src ? (
                  <ImageWithFallback
                    src={src}
                    alt={`${review.restaurantName} 이미지 ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {review.isRecommended && (
            <Badge className="absolute right-2 top-2 bg-[#FFAE42] text-white border-transparent px-3 py-1 text-xs font-semibold">
              추천
            </Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-[1.2] truncate">
              {review.restaurantName}
            </h3>
            <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
              <span>{review.distance}</span>
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {review.totalReviews}
              </span>
            </div>
          </div>

          <div className="mt-[-2px] flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] bg-muted text-[9px] font-semibold text-foreground">
              AI
            </span>
            <span>{review.tagLine}</span>
          </div>

          <div className="mt-2 h-px w-full bg-border" />

          <p className="mt-2 text-sm text-muted-foreground line-clamp-1 whitespace-pre-wrap">
            {review.summary}
          </p>

          <div className="mt-2 flex items-center justify-between text-xs font-normal text-muted-foreground">
            <span>작성자 · {review.author}</span>
            <span>{review.createdAt}</span>
          </div>
        </div>
      </button>
    </Card>
  )
}
