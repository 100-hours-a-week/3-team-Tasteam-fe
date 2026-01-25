import { MapPin, Star, Heart } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'
import type { RestaurantListItemDto, RestaurantDetailDto } from '../model/dto'

type RestaurantData = RestaurantListItemDto | RestaurantDetailDto

type RestaurantCardProps = {
  restaurant: RestaurantData
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onClick?: () => void
  className?: string
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`
  return `${(meters / 1000).toFixed(1)}km`
}

function getImageUrl(restaurant: RestaurantData): string {
  if ('thumbnailImage' in restaurant) {
    return restaurant.thumbnailImage.url
  }
  return restaurant.images[0]?.url ?? ''
}

function getRecommendRatio(restaurant: RestaurantData): number | undefined {
  if ('recommendStat' in restaurant && restaurant.recommendStat) {
    return restaurant.recommendStat.positiveRatio
  }
  return undefined
}

export function RestaurantCard({
  restaurant,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  className,
}: RestaurantCardProps) {
  const ratio = getRecommendRatio(restaurant)

  return (
    <Card
      className={cn('overflow-hidden cursor-pointer transition-all hover:shadow-md', className)}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={getImageUrl(restaurant)}
          alt={restaurant.name}
          className="object-cover w-full h-full"
        />
        {onFavoriteToggle && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background',
              isFavorite && 'text-primary',
            )}
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle()
            }}
            aria-label={isFavorite ? '저장 취소' : '저장'}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </Button>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 min-w-0 truncate font-medium">{restaurant.name}</h3>
          {ratio !== undefined && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>{(ratio * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{restaurant.foodCategories[0]}</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{formatDistance(restaurant.distanceMeter)}</span>
          </div>
        </div>
        {restaurant.foodCategories.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {restaurant.foodCategories.slice(1, 4).map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
