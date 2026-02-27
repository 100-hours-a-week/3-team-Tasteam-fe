import { MapPin, Heart, Sparkles } from 'lucide-react'
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
  category?: string
  foodCategories?: string[]
  rating?: number
  reviewCount?: number
  distance?: number | string
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
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

function normalizeDistanceLabel(distance?: number | string): string {
  if (distance == null) return ''

  if (typeof distance === 'number') {
    if (!Number.isFinite(distance)) return ''
    return formatDistance(Math.max(0, distance))
  }

  const raw = distance.trim()
  if (!raw) return ''

  const match = raw.match(/^([0-9]+(?:\.[0-9]+)?)\s*(km|m)?$/i)
  if (!match) return raw

  const value = Number(match[1])
  if (!Number.isFinite(value)) return raw

  const unit = (match[2] ?? 'm').toLowerCase()
  const meters = unit === 'km' ? value * 1000 : value
  return formatDistance(Math.max(0, meters))
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
  return (restaurant.images ?? []).map((img) => img.url)
}

function normalizeReviewSummary(value?: string): string {
  const trimmed = value?.trim()
  if (!trimmed) return ''
  return trimmed.replace(/^["'`“”‘’]\s*(.*?)\s*["'`“”‘’]$/, '$1')
}

function normalizeFoodCategories(categories?: string[]): string[] {
  if (!Array.isArray(categories)) return []
  return categories
    .map((category) => (typeof category === 'string' ? category.trim() : ''))
    .filter((category) => category.length > 0)
}

function resolveCategoryText(categories?: string[], fallbackCategory?: string): string {
  const normalized = normalizeFoodCategories(categories)
  if (normalized.length > 0) return normalized.join(' · ')
  const fallback = fallbackCategory?.trim()
  return fallback && fallback.length > 0 ? fallback : '기타'
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
      foodCategories,
      distance,
      address,
      tags,
      isSaved,
      onSave,
      reviewSummary,
      onClick,
      className,
    } = props
    const distanceText = normalizeDistanceLabel(distance)
    const addressText = address?.trim() ?? ''
    const summary = normalizeReviewSummary(reviewSummary)
    const categoryText = resolveCategoryText(foodCategories, category)

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
        <div className="px-4 pb-4 pt-4 space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span className="min-w-0 truncate" title={categoryText}>
              {categoryText}
            </span>
            {distanceText && (
              <div className="flex items-start gap-1 min-w-0 max-w-[55%]">
                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="break-words text-right leading-tight">{distanceText}</span>
              </div>
            )}
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex-1 min-w-0 truncate text-[17px]">{name}</h3>
          </div>
          {!distanceText && addressText && (
            <div className="flex items-start gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
              <span className="line-clamp-1 break-words">{addressText}</span>
            </div>
          )}
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
            <div className="!mt-6 p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary/80 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 fill-primary/20" />
                <span>AI 리뷰 요약</span>
              </div>
              <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed italic break-words">
                {summary}
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
  const summary = normalizeReviewSummary(reviewSummary)
  const categoryText = resolveCategoryText(restaurant.foodCategories)

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
      <div className="px-4 pb-4 pt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex-1 min-w-0 truncate" title={categoryText}>
            {categoryText}
          </span>
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <MapPin className="h-3 w-3" />
            <span>{formatDistance(restaurant.distanceMeter ?? 0)}</span>
          </div>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 min-w-0 truncate text-[17px]">{restaurant.name}</h3>
        </div>
        {summary && (
          <div className="!mt-6 p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary/80 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 fill-primary/20" />
              <span>AI 리뷰 요약</span>
            </div>
            <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed italic break-words">
              {summary}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
