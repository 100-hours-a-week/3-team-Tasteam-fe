import { MapPin, Star, Heart, Sparkles } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'
import type { RestaurantListItemDto, RestaurantDetailDto } from '../model/dto'

type RestaurantDtoProps = {
  restaurant: RestaurantListItemDto | RestaurantDetailDto
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  reviewSummary?: string
  onClick?: () => void
  className?: string
}

type RestaurantSimpleProps = {
  id?: string
  name: string
  category: string
  rating?: number
  reviewCount?: number
  distance?: string
  address?: string
  image?: string
  imageUrl?: string
  images?: string[]
  tags?: string[]
  isSaved?: boolean
  onSave?: () => void
  reviewSummary?: string
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

function getCardImages(props: RestaurantCardProps): string[] {
  if (isSimpleProps(props)) {
    if (props.images && props.images.length > 0) return props.images
    if (props.image) return [props.image]
    if (props.imageUrl) return [props.imageUrl]
    return []
  }

  const { restaurant } = props
  if ('thumbnailImage' in restaurant) {
    return [restaurant.thumbnailImage.url]
  }
  return restaurant.images.map((img) => img.url)
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
  const images = getCardImages(props)

  const renderImages = () => (
    <div className="relative h-36 flex overflow-hidden bg-muted">
      {images.length > 1 ? (
        <>
          <div className="w-1/2 h-full border-r border-white/10 relative">
            <ImageWithFallback
              src={images[0]}
              alt="restaurant image 1"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-1/2 h-full relative">
            <ImageWithFallback
              src={images[1]}
              alt="restaurant image 2"
              className="object-cover w-full h-full"
            />
            {images.length > 2 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium">
                +{images.length - 2}
              </div>
            )}
          </div>
        </>
      ) : (
        <ImageWithFallback
          src={images[0] || ''}
          alt="restaurant image"
          className="object-cover w-full h-full"
        />
      )}
    </div>
  )

  if (isSimpleProps(props)) {
    const {
      name,
      category,
      rating,
      reviewCount,
      distance,
      address,
      tags,
      isSaved,
      onSave,
      reviewSummary,
      onClick,
      className,
    } = props
    const locationText = distance || address || ''
    const summary = reviewSummary?.trim()

    return (
      <Card
        className={cn(
          'overflow-hidden cursor-pointer transition-all hover:shadow-md p-0 gap-0',
          className,
        )}
        onClick={onClick}
      >
        <div className="relative">
          {renderImages()}
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background z-10',
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
            <h3 className="flex-1 min-w-0 truncate">{name}</h3>
            {rating !== undefined && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{rating.toFixed(1)}</span>
                {reviewCount !== undefined && (
                  <span className="text-muted-foreground">({reviewCount})</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{category}</span>
            {locationText && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{locationText}</span>
              </div>
            )}
          </div>
          {!images.length && onSave && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(isSaved && 'text-primary')}
              onClick={(e) => {
                e.stopPropagation()
                onSave()
              }}
            >
              <Heart className={cn('h-4 w-4 mr-1', isSaved && 'fill-current')} />
              {isSaved ? '저장됨' : '저장'}
            </Button>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {summary && (
            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary/80 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 fill-primary/20" />
                <span>AI 리뷰 요약</span>
              </div>
              <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed italic">
                "{summary}"
              </p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  const {
    restaurant,
    isFavorite = false,
    onFavoriteToggle,
    reviewSummary,
    onClick,
    className,
  } = props
  const ratio = getRecommendRatio(restaurant)
  const summary = reviewSummary?.trim()

  return (
    <Card
      className={cn(
        'overflow-hidden cursor-pointer transition-all hover:shadow-md p-0 gap-0',
        className,
      )}
      onClick={onClick}
    >
      <div className="relative">
        {renderImages()}
        {onFavoriteToggle && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background z-10',
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
          <h3 className="flex-1 min-w-0 truncate">{restaurant.name}</h3>
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
        {summary && (
          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary/80 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 fill-primary/20" />
              <span>AI 리뷰 요약</span>
            </div>
            <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed italic">
              "{summary}"
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
