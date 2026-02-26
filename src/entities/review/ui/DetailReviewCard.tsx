import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/ui/card'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { ImagePreviewDialog } from '@/shared/ui/image-preview-dialog'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/config/routes'
import type { ReviewListItemDto, ReviewDetailDto } from '../model/dto'

export type DetailReviewCardVariant = 'restaurant' | 'group'

export type DetailReviewCardProps = {
  variant: DetailReviewCardVariant
  review: ReviewListItemDto | ReviewDetailDto
  /** variant="group"일 때 음식점 상단 강조용 */
  restaurantId?: number
  restaurantName?: string
  className?: string
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getImages(review: ReviewListItemDto | ReviewDetailDto): string[] {
  if ('images' in review && Array.isArray(review.images) && review.images.length > 0) {
    return review.images.map((img) => img.url)
  }
  if (
    'thumbnailImages' in review &&
    Array.isArray((review as { thumbnailImages?: { url: string }[] }).thumbnailImages)
  ) {
    return (review as { thumbnailImages: { url: string }[] }).thumbnailImages.map((img) => img.url)
  }
  if ('thumbnailImage' in review && review.thumbnailImage) {
    return [review.thumbnailImage.url]
  }
  return []
}

function getContent(review: ReviewListItemDto | ReviewDetailDto): string {
  if ('content' in review) {
    return review.content
  }
  return review.contentPreview
}

export function DetailReviewCard({
  variant,
  review,
  restaurantId,
  restaurantName,
  className,
}: DetailReviewCardProps) {
  const images = getImages(review)
  const content = getContent(review)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(new Set())

  const groupName =
    'groupName' in review && review.groupName != null && review.groupName !== ''
      ? review.groupName
      : null
  const groupId = 'groupId' in review ? review.groupId : undefined

  const effectiveRestaurantId =
    restaurantId ??
    ('restaurantId' in review ? review.restaurantId : undefined) ??
    ('restaurant' in review ? review.restaurant?.id : undefined)
  const effectiveRestaurantName =
    restaurantName ??
    ('restaurantName' in review ? review.restaurantName : undefined) ??
    ('restaurant' in review ? review.restaurant?.name : undefined)

  const groupLogoImageUrl = 'groupLogoImageUrl' in review ? review.groupLogoImageUrl : undefined
  const groupAddress = 'groupAddress' in review ? review.groupAddress : undefined
  const restaurantImageUrl = 'restaurantImageUrl' in review ? review.restaurantImageUrl : undefined
  const restaurantAddress = 'restaurantAddress' in review ? review.restaurantAddress : undefined

  return (
    <Card className={cn('p-4 gap-0', className)}>
      {/* 한 줄: 그룹/음식점 맥락(이미지 + 이름 옆 추천 라벨 + 주소) */}
      <div className="flex items-start gap-3 mb-3 pb-3 border-b">
        {variant === 'restaurant' && groupName != null && (
          <>
            {groupLogoImageUrl != null && groupLogoImageUrl !== '' && (
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                <img src={groupLogoImageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-semibold truncate min-w-0">
                  {groupId != null ? (
                    <Link
                      to={ROUTES.groupDetail(String(groupId))}
                      className="hover:text-primary truncate"
                    >
                      {groupName}
                    </Link>
                  ) : (
                    <span>{groupName}</span>
                  )}
                </h4>
                <span
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[10px] font-medium h-5',
                    review.isRecommended
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border bg-muted/60 text-muted-foreground',
                  )}
                >
                  {review.isRecommended ? (
                    <ThumbsUp className="h-3 w-3 fill-current" />
                  ) : (
                    <ThumbsDown className="h-3 w-3" />
                  )}
                  {review.isRecommended ? '추천' : '비추천'}
                </span>
              </div>
              {groupAddress != null && groupAddress !== '' && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate" title={groupAddress}>
                    {groupAddress}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
        {variant === 'group' &&
          effectiveRestaurantName != null &&
          effectiveRestaurantName !== '' && (
            <>
              {restaurantImageUrl != null && restaurantImageUrl !== '' && (
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={restaurantImageUrl}
                    alt={effectiveRestaurantName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">
                    {effectiveRestaurantId != null ? (
                      <Link
                        to={ROUTES.restaurantDetail(String(effectiveRestaurantId))}
                        className="hover:text-primary"
                      >
                        {effectiveRestaurantName}
                      </Link>
                    ) : (
                      <span>{effectiveRestaurantName}</span>
                    )}
                  </h4>
                  <span
                    className={cn(
                      'shrink-0 inline-flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[10px] font-medium h-5',
                      review.isRecommended
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-border bg-muted/60 text-muted-foreground',
                    )}
                  >
                    {review.isRecommended ? (
                      <ThumbsUp className="h-3 w-3 fill-current" />
                    ) : (
                      <ThumbsDown className="h-3 w-3" />
                    )}
                    {review.isRecommended ? '추천' : '비추천'}
                  </span>
                </div>
                {restaurantAddress != null && restaurantAddress !== '' && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate" title={restaurantAddress}>
                      {restaurantAddress}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
      </div>
      {/* 사진 → 본문 → 키워드 순 (가로 슬라이드, 큰 사진) */}
      {images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-3 -mx-1 px-1 scroll-smooth">
          {images.map((image, idx) => {
            const isFailed = failedImageUrls.has(image)
            const onError = () => setFailedImageUrls((prev) => new Set(prev).add(image))
            if (isFailed) {
              return (
                <div
                  key={idx}
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-lg overflow-hidden bg-muted shrink-0 cursor-default"
                  aria-hidden
                >
                  <ImageWithFallback
                    src={image}
                    alt={`리뷰 이미지 ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={onError}
                  />
                </div>
              )
            }
            return (
              <button
                key={idx}
                type="button"
                className="w-56 h-56 sm:w-64 sm:h-64 rounded-lg overflow-hidden bg-muted shrink-0 p-0 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => setPreviewImageUrl(image)}
                aria-label={`리뷰 이미지 ${idx + 1} 크게 보기`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`리뷰 이미지 ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={onError}
                />
              </button>
            )
          })}
        </div>
      )}
      <ImagePreviewDialog
        open={previewImageUrl != null}
        onClose={() => setPreviewImageUrl(null)}
        imageUrl={previewImageUrl ?? ''}
        alt="리뷰 이미지"
      />
      <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{content}</p>
      {(review.keywords?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(review.keywords ?? []).map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center rounded-lg border border-border bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
      {/* 하단: 왼쪽 프로필+사용자명, 오른쪽 작성일 */}
      <div className="flex items-center justify-between gap-3 pt-5 mt-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar className="h-5 w-5 shrink-0">
            <AvatarFallback className="text-[9px]">
              {review.author.nickname.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span
            className="text-[11px] text-muted-foreground truncate"
            title={review.author.nickname}
          >
            {review.author.nickname}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground shrink-0">
          {formatDate(review.createdAt)}
        </span>
      </div>
    </Card>
  )
}
