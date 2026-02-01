import { MapPin, Star } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'

type VerticalRestaurantCardProps = {
  id: number
  name: string
  category: string
  rating?: number
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
  rating,
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
        <Badge variant="secondary" className="text-xs">
          {reason}
        </Badge>
      )}
      <Card
        className={cn('overflow-hidden cursor-pointer transition-all hover:shadow-md p-0')}
        onClick={() => onClick?.(String(id))}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <ImageWithFallback src={image} alt={name} className="object-cover w-full h-full" />
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex-1 min-w-0 truncate text-base font-semibold">{name}</h3>
            {rating !== undefined && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{category}</span>
            <div className="flex items-center gap-1">
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
