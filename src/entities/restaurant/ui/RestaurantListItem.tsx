import { MapPin, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import type { RestaurantListItemDto } from '../model/dto'

type RestaurantListItemDtoProps = {
  restaurant: RestaurantListItemDto
  rating?: number
  onClick?: () => void
  className?: string
}

type RestaurantListItemSimpleProps = {
  id?: string
  name: string
  category: string
  rating?: number
  distance: string
  image: string
  onClick?: () => void
  className?: string
}

type RestaurantListItemProps = RestaurantListItemDtoProps | RestaurantListItemSimpleProps

function isSimpleProps(props: RestaurantListItemProps): props is RestaurantListItemSimpleProps {
  return 'name' in props && !('restaurant' in props)
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export function RestaurantListItem(props: RestaurantListItemProps) {
  if (isSimpleProps(props)) {
    const { name, category, rating, distance, image, onClick, className } = props
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left',
          className,
        )}
      >
        <Avatar className="h-12 w-12 rounded-lg shrink-0">
          <AvatarImage src={image} alt={name} className="object-cover" />
          <AvatarFallback className="rounded-lg">{name.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate flex-1">{name}</h4>
            {rating !== undefined && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{category}</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{distance}</span>
            </div>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </button>
    )
  }

  const { restaurant, rating, onClick, className } = props
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left',
        className,
      )}
    >
      <Avatar className="h-12 w-12 rounded-lg shrink-0">
        <AvatarImage
          src={restaurant.thumbnailImage.url}
          alt={restaurant.name}
          className="object-cover"
        />
        <AvatarFallback className="rounded-lg">{restaurant.name.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate flex-1">{restaurant.name}</h4>
          {rating !== undefined && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{restaurant.foodCategories[0]}</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{formatDistance(restaurant.distanceMeter)}</span>
          </div>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
    </button>
  )
}
