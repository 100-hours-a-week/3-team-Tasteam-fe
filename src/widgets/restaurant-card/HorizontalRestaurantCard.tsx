import { MapPin } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'
import { formatDisplayNumber } from '@/shared/lib/formatDisplayNumber'
import type { ImageResource } from '@/shared/types/common'

type HorizontalRestaurantCardProps = {
  id: number
  name: string
  category: string
  address?: string
  distance?: number | string
  image?: ImageResource | string | null
  tags?: string[]
  onClick?: (id: string) => void
  className?: string
}

const resolveImageUrl = (image?: ImageResource | string | null) => {
  if (!image) return ''
  return typeof image === 'string' ? image : image.url
}

const formatDistanceLabel = (distance?: number | string) => {
  if (distance == null) return ''
  if (typeof distance === 'string') return distance
  if (!Number.isFinite(distance)) return ''

  if (distance < 1000) {
    return `${formatDisplayNumber(distance)}m`
  }

  const km = distance / 1000
  return `${formatDisplayNumber(km)}km`
}

export function HorizontalRestaurantCard({
  id,
  name,
  category,
  address,
  distance,
  image,
  tags = [],
  onClick,
  className,
}: HorizontalRestaurantCardProps) {
  const distanceLabel = formatDistanceLabel(distance)
  const imageUrl = resolveImageUrl(image)

  return (
    <Card
      className={cn(
        'overflow-hidden cursor-pointer transition-all hover:shadow-md p-0 gap-2',
        className,
      )}
      onClick={() => onClick?.(String(id))}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ImageWithFallback src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </div>
      <div className="px-4 pb-4 pt-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 min-w-0 truncate font-semibold">{name}</h3>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="min-w-0 truncate">{address ?? category}</span>
          <div className="flex items-center gap-1 shrink-0">
            <MapPin className="h-3 w-3" />
            <span>{distanceLabel}</span>
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
  )
}
