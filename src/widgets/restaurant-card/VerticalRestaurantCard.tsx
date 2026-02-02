import { MapPin, Sparkles } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'

type VerticalRestaurantCardProps = {
  id: number
  name: string
  category: string
  address?: string
  distance: string
  image: string
  tags?: string[]
  reason?: string
  onClick?: (id: string) => void
  className?: string
}

export function VerticalRestaurantCard({
  id,
  name,
  category,
  address,
  distance,
  image,
  tags = [],
  reason,
  onClick,
  className,
}: VerticalRestaurantCardProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {reason && (
        <Badge
          variant="secondary"
          className="text-xs inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-foreground/80"
        >
          <Sparkles className="h-3 w-3" />
          AI 리뷰 한줄 요약: {reason}
        </Badge>
      )}
      <Card
        className={cn('overflow-hidden cursor-pointer transition-all hover:shadow-md p-0 gap-2')}
        onClick={() => onClick?.(String(id))}
      >
        <div className="relative aspect-[21/10] overflow-hidden bg-muted">
          <ImageWithFallback src={image} alt={name} className="object-cover w-full h-full" />
        </div>
        <div className="px-4 pb-4 pt-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex-1 min-w-0 truncate text-[17px] font-semibold leading-tight">
              {name}
            </h3>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span className="min-w-0 truncate">{address ?? category}</span>
            <div className="flex items-center gap-1 shrink-0">
              <MapPin className="h-3 w-3" />
              <span>{distance}</span>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
