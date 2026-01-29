import { Image as ImageIcon, MessageSquare } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'

export type MainRestaurantCardItem = {
  restaurantId: number
  name: string
  category: string
  distanceMeter: number
  thumbnailImageUrl: string
  isFavorite: boolean
  reviewSummary: string
}

type MainRestaurantCardProps = {
  item: MainRestaurantCardItem
  onClick?: (restaurantId: string) => void
  className?: string
}

export function MainRestaurantCard({ item, onClick, className }: MainRestaurantCardProps) {
  const images = [item.thumbnailImageUrl, '', '']

  return (
    <Card className={cn('overflow-hidden border border-border p-0 gap-0', className)}>
      <button
        type="button"
        onClick={() => onClick?.(String(item.restaurantId))}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative">
          <div className={cn('grid gap-px bg-border', 'grid-cols-3')}>
            {images.map((src, index) => (
              <div
                key={`${item.restaurantId}-img-${index}`}
                className="relative bg-muted aspect-square"
              >
                {src ? (
                  <ImageWithFallback
                    src={src}
                    alt={`${item.name} 이미지 ${index + 1}`}
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
          {item.isFavorite && (
            <Badge className="absolute right-2 top-2 bg-[#FFAE42] text-white border-transparent px-3 py-1 text-xs font-semibold">
              찜
            </Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-[1.2] truncate">{item.name}</h3>
            <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
              <span>{item.distanceMeter}m</span>
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {item.reviewSummary}
              </span>
            </div>
          </div>

          <div className="mt-[-2px] flex items-center gap-2 text-sm text-muted-foreground">
            <span>{item.category}</span>
          </div>
        </div>
      </button>
    </Card>
  )
}
