import { Heart, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import type { FavoriteRestaurantItem } from '@/entities/favorite'

type FavoriteRestaurantCardProps = {
  restaurant: FavoriteRestaurantItem
  onRemove: (e: React.MouseEvent) => void
  onClick: () => void
  /** false면 찜 해제 버튼 숨김 (읽기 전용, 예: 하위 그룹 상세) */
  showRemoveButton?: boolean
  /** 하위 그룹 상세에서 그룹 찜 수 표시 */
  showGroupFavoriteCount?: boolean
}

const formatFavoriteCount = (count: number) => {
  if (count > 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return String(count)
}

export function FavoriteRestaurantCard({
  restaurant,
  onRemove,
  onClick,
  showRemoveButton = true,
  showGroupFavoriteCount = false,
}: FavoriteRestaurantCardProps) {
  const categoryText =
    restaurant.foodCategories
      ?.map((category) => category.trim())
      .filter((category) => category.length > 0)
      .join(' · ') ||
    restaurant.category ||
    ''

  const shouldShowGroupFavoriteCount =
    showGroupFavoriteCount && typeof restaurant.groupFavoriteCount === 'number'
  const groupFavoriteCount = restaurant.groupFavoriteCount

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow py-0"
      onClick={onClick}
    >
      <CardContent
        className={
          showRemoveButton || shouldShowGroupFavoriteCount
            ? 'relative px-3 py-2.5 pr-12'
            : 'relative px-3 py-2.5'
        }
      >
        <div className="flex gap-3">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            {restaurant.thumbnailUrl ? (
              <ImageWithFallback
                src={restaurant.thumbnailUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-accent flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info - 세로 배치 */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* 카테고리 */}
            {categoryText && (
              <p className="text-xs text-muted-foreground mb-1 truncate" title={categoryText}>
                {categoryText}
              </p>
            )}
            {/* 음식점명 */}
            <h4 className="font-semibold mb-3 truncate">{restaurant.name}</h4>
            {/* 주소 */}
            {restaurant.address && (
              <div className="flex items-start gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1 break-words">{restaurant.address}</span>
              </div>
            )}
          </div>
        </div>
        {shouldShowGroupFavoriteCount && typeof groupFavoriteCount === 'number' && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs text-muted-foreground">
            <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
            <span>{formatFavoriteCount(groupFavoriteCount)}</span>
          </div>
        )}
        {showRemoveButton && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-colors z-10"
            aria-label="찜 해제"
          >
            <Heart className="w-5 h-5 text-primary fill-primary" />
          </button>
        )}
      </CardContent>
    </Card>
  )
}
