import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Heart,
  MapPin,
  Clock,
  Phone,
  ChevronRight,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel'
import { Skeleton } from '@/shared/ui/skeleton'
import { RestaurantMetaRow } from '@/entities/restaurant/ui'
import { ReviewCard } from '@/entities/review/ui'
import { Container } from '@/widgets/container'
import { cn } from '@/shared/lib/utils'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'
import { getRestaurant } from '@/entities/restaurant/api/restaurantApi'
import { getRestaurantReviews } from '@/entities/review/api/reviewApi'
import type { ReviewListItemDto } from '@/entities/review/model/dto'

export function RestaurantDetailPage() {
  type BusinessHoursWeekItem = {
    date: string
    dayOfWeek: string
    isClosed: boolean | null
    openTime: string | null
    closeTime: string | null
    source: string
    reason: string | null
  }

  const { id: restaurantId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = React.useState(false)
  const [isRestaurantLoading, setIsRestaurantLoading] = React.useState(true)
  const [restaurantData, setRestaurantData] = React.useState<{
    id: number
    name: string
    address: string
    foodCategories: string[]
    businessHoursWeek?: BusinessHoursWeekItem[]
    images?: { id: string; url: string }[]
    image?: { id: number | string; url: string } | null
    recommendStat?: {
      recommendedCount: number
      notRecommendedCount: number
      positiveRatio: number
    }
    aiSummary?: string | null
    aiFeatures?: string | null
  } | null>(null)

  React.useEffect(() => {
    if (!restaurantId) return
    setIsRestaurantLoading(true)
    getRestaurant(Number(restaurantId))
      .then((res) => setRestaurantData(res.data))
      .catch(() => {
        setRestaurantData(null)
      })
      .finally(() => setIsRestaurantLoading(false))
  }, [restaurantId])

  const [isReviewsLoading, setIsReviewsLoading] = React.useState(true)
  const [reviewsError, setReviewsError] = React.useState(false)
  const [previewReviews, setPreviewReviews] = React.useState<ReviewListItemDto[]>([])

  React.useEffect(() => {
    if (!restaurantId) return
    setIsReviewsLoading(true)
    setReviewsError(false)
    getRestaurantReviews(Number(restaurantId), { size: 3 })
      .then((res) => {
        setPreviewReviews(res.items?.slice(0, 3) ?? [])
      })
      .catch(() => {
        setPreviewReviews([])
        setReviewsError(true)
      })
      .finally(() => setIsReviewsLoading(false))
  }, [restaurantId])

  const baseRestaurant = {
    id: restaurantId || '',
    name: '',
    category: '',
    reviewCount: 0,
    address: '',
    phone: '',
    hours: '',
    breakTime: '',
    lastOrder: '',
    closedDays: '',
    images: [] as string[],
    feature: '',
    aiSummary: '',
    sentiment: {
      positive: 0,
      negative: 0,
    },
    businessHoursWeek: null as BusinessHoursWeekItem[] | null,
  }

  const restaurant = (() => {
    if (!restaurantData) return baseRestaurant

    const positiveRatio = restaurantData.recommendStat?.positiveRatio
    const sentiment =
      typeof positiveRatio === 'number'
        ? {
            positive: positiveRatio,
            negative: Math.max(0, 100 - positiveRatio),
          }
        : baseRestaurant.sentiment

    const reviewCountFromStat = restaurantData.recommendStat
      ? restaurantData.recommendStat.recommendedCount +
        restaurantData.recommendStat.notRecommendedCount
      : baseRestaurant.reviewCount

    const imagesFromApi =
      restaurantData.images && restaurantData.images.length > 0
        ? restaurantData.images.map((img) => img.url)
        : restaurantData.image?.url
          ? [restaurantData.image.url]
          : null
    const images = imagesFromApi ?? baseRestaurant.images

    return {
      ...baseRestaurant,
      id: String(restaurantData.id),
      name: restaurantData.name,
      category: restaurantData.foodCategories[0] ?? baseRestaurant.category,
      address: restaurantData.address,
      images,
      reviewCount: reviewCountFromStat,
      aiSummary: restaurantData.aiSummary ?? baseRestaurant.aiSummary,
      feature: restaurantData.aiFeatures ?? baseRestaurant.feature,
      sentiment,
      businessHoursWeek: restaurantData.businessHoursWeek ?? null,
    }
  })()

  const dayOfWeekLabel: Record<string, string> = {
    MON: '월',
    TUE: '화',
    WED: '수',
    THU: '목',
    FRI: '금',
    SAT: '토',
    SUN: '일',
  }

  const todayString = (() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })()

  const formatBusinessHour = (
    item: Pick<BusinessHoursWeekItem, 'isClosed' | 'openTime' | 'closeTime' | 'source' | 'reason'>,
  ) => {
    if (item.isClosed) {
      if (item.source === 'WEEKLY') return '정기 휴무'
      const reasonText = item.reason ? ` (${item.reason})` : ''
      return `임시 휴무${reasonText}`
    }
    if (!item.openTime || !item.closeTime) return '정보 없음'
    return `${item.openTime} - ${item.closeTime}`
  }

  const isTodayRow = (item: BusinessHoursWeekItem, index: number) => {
    if (item.date) return item.date === todayString
    return index === 0
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleWriteReview = () => {
    navigate(`/restaurants/${restaurantId}/review`)
  }

  return (
    <div className="pb-6">
      <TopAppBar showBackButton onBack={() => navigate(-1)} />

      {/* Image Carousel */}
      <div className="relative mb-4">
        {isRestaurantLoading ? (
          <div className="aspect-[4/3] w-full">
            <Skeleton className="w-full h-full" />
          </div>
        ) : restaurant.images.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {restaurant.images.map((image, idx) => (
                <CarouselItem key={idx}>
                  <div className="aspect-[4/3] bg-muted">
                    <img
                      src={image}
                      alt={`${restaurant.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
            이미지가 없습니다
          </div>
        )}
      </div>

      {/* Restaurant Info */}
      <Container className="space-y-4 mb-6">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0 flex-1">
              {isRestaurantLoading ? (
                <>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-7 w-48" />
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">{restaurant.category || '카테고리 없음'}</p>
                  <h1 className="text-2xl font-bold mb-1 truncate">
                    {restaurant.name || '음식점 정보 없음'}
                  </h1>
                </>
              )}
            </div>
            {FEATURE_FLAGS.enableRestaurantFavorite && (
              <Button
                variant={isSaved ? 'default' : 'secondary'}
                size="icon"
                className="shrink-0 rounded-full border border-gray-300 shadow-md bg-white text-foreground hover:bg-white/90"
                onClick={handleSave}
                aria-pressed={isSaved}
                aria-label="찜"
              >
                <Heart className={cn('h-5 w-5 text-primary', isSaved && 'fill-primary')} />
              </Button>
            )}
          </div>

          {/* Restaurant Feature - AI Highlighted */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">AI 특징 요약</span>
            </div>
            {isRestaurantLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {restaurant.feature || '특징 정보가 없습니다.'}
              </p>
            )}
          </div>
        </div>
      </Container>

      {/* Details Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <Container>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="info">정보</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
          </TabsList>
        </Container>

        <TabsContent value="info" className="mt-4">
          <Container className="space-y-6">
            {/* Business Hours */}
            <Card className="p-4 space-y-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Clock className="h-5 w-5" />
                영업 시간
              </h3>
              <div className="space-y-3 text-sm">
                {isRestaurantLoading ? (
                  <>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </>
                ) : restaurant.businessHoursWeek && restaurant.businessHoursWeek.length > 0 ? (
                  restaurant.businessHoursWeek.map((item: BusinessHoursWeekItem, index: number) => {
                    const isToday = isTodayRow(item, index)
                    const dayLabel = dayOfWeekLabel[item.dayOfWeek] ?? item.dayOfWeek
                    const hourText = formatBusinessHour({
                      isClosed: item.isClosed,
                      openTime: item.openTime,
                      closeTime: item.closeTime,
                      source: item.source,
                      reason: item.reason,
                    })
                    const isClosed = item.isClosed === true
                    return (
                      <div
                        key={`${item.date}-${index}`}
                        className={cn(
                          'flex justify-between rounded-md px-2 py-1',
                          isToday && 'bg-primary/10 border-l-4 border-primary',
                        )}
                      >
                        <span
                          className={cn(
                            'text-muted-foreground flex items-center gap-2',
                            isToday && 'font-bold text-foreground',
                          )}
                        >
                          {dayLabel}요일
                        </span>
                        <span
                          className={cn(
                            'max-w-[60%] text-right break-words',
                            isClosed && 'text-destructive font-medium',
                          )}
                        >
                          {hourText}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">영업시간</span>
                      <span>{restaurant.hours || '정보 없음'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">브레이크타임</span>
                      <span>{restaurant.breakTime || '정보 없음'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">라스트오더</span>
                      <span>{restaurant.lastOrder || '정보 없음'}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-1">
                      <span className="text-muted-foreground">정기휴무</span>
                      <span className="text-destructive font-medium">
                        {restaurant.closedDays || '정보 없음'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Contact & Location */}
            <Card className="divide-y overflow-hidden">
              {isRestaurantLoading ? (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ) : (
                <>
                  <RestaurantMetaRow
                    icon={MapPin}
                    label="주소"
                    value={restaurant.address || '정보 없음'}
                  />
                  <RestaurantMetaRow
                    icon={Phone}
                    label="전화번호"
                    value={restaurant.phone || '정보 없음'}
                  />
                </>
              )}
            </Card>
          </Container>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Container className="space-y-4">
            {/* AI Review Summary & Sentiment */}
            <Card className="p-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  {isRestaurantLoading ? (
                    <>
                      <Skeleton className="h-7 w-40 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-1">
                        총 {restaurant.reviewCount}개 리뷰
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        방문객들의 생생한 후기를 확인해보세요
                      </p>
                    </>
                  )}
                </div>
                <Button onClick={handleWriteReview}>리뷰 작성</Button>
              </div>

              {/* Sentiment Bar - Added as per request */}
              <div className="space-y-2">
                {isRestaurantLoading ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="flex items-center gap-1 text-primary">
                        <ThumbsUp className="h-4 w-4" /> 긍정 {restaurant.sentiment.positive}%
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        부정 {restaurant.sentiment.negative}% <ThumbsDown className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${restaurant.sentiment.positive}%` }}
                      />
                      <div
                        className="h-full bg-muted-foreground/30"
                        style={{ width: `${restaurant.sentiment.negative}%` }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* AI Summary - Added as per request */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-primary">리뷰 AI 요약</span>
                </div>
                {isRestaurantLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {restaurant.aiSummary || '요약 정보가 없습니다.'}
                  </p>
                )}
              </div>
            </Card>

            {/* Review List */}
            <div className="space-y-3">
              {isReviewsLoading ? (
                <>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : previewReviews.length > 0 ? (
                previewReviews.map((review) => <ReviewCard key={review.id} review={review} />)
              ) : (
                <div className="text-sm text-muted-foreground">
                  {reviewsError ? '리뷰를 불러오지 못했습니다.' : '리뷰가 없습니다.'}
                </div>
              )}
            </div>

            {/* Load More */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/restaurants/${restaurantId}/reviews`)}
            >
              리뷰 더보기
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Container>
        </TabsContent>
      </Tabs>
    </div>
  )
}
