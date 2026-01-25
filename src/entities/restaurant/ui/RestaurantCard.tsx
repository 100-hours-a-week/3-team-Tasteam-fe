import { MapPin, Star, Heart } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'
import type { RestaurantListItemDto, RestaurantDetailDto } from '../model/dto'

type RestaurantDtoProps = {
  restaurant: RestaurantListItemDto | RestaurantDetailDto
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onClick?: () => void
  className?: string
}

type RestaurantSimpleProps = {
  id: string
  name: string
  category: string
  rating?: number
  distance: string
  image: string
  tags?: string[]
  isSaved?: boolean
  onSave?: () => void
  onClick?: () => void
  className?: string
}

type RestaurantCardProps = RestaurantDtoProps | RestaurantSimpleProps

function isSimpleProps(props: RestaurantCardProps): props is RestaurantSimpleProps {
  return 'name' in props && !('restaurant' in props)
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`
  return `${(meters / 1000).toFixed(1)}km`
}

function getImageUrl(restaurant: RestaurantListItemDto | RestaurantDetailDto): string {
  if ('thumbnailImage' in restaurant) {
    return restaurant.thumbnailImage.url
  }
  return restaurant.images[0]?.url ?? ''
}

function getRecommendRatio(
  restaurant: RestaurantListItemDto | RestaurantDetailDto,
): number | undefined {
  if ('recommendStat' in restaurant && restaurant.recommendStat) {
    return restaurant.recommendStat.positiveRatio
  }
  return undefined
}

export function RestaurantCard(props: RestaurantCardProps) {
  if (isSimpleProps(props)) {
    const { name, category, rating, distance, image, tags, isSaved, onSave, onClick, className } =
      props
    return (
      <Card
        className={cn('overflow-hidden cursor-pointer transition-all hover:shadow-md', className)}
        onClick={onClick}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img src={image} alt={name} className="object-cover w-full h-full" />
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background',
                isSaved && 'text-primary',
              )}
              onClick={(e) => {
                e.stopPropagation()
                onSave()
              }}
              aria-label={isSaved ? '저장 취소' : '저장'}
            >
              <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
            </Button>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex-1 min-w-0 truncate font-medium">{name}</h3>
            {rating !== undefined && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{rating}</span>
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
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    )
  }

  const { restaurant, isFavorite = false, onFavoriteToggle, onClick, className } = props
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
