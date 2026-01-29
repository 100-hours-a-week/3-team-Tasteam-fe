import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, MapPin, ChevronRight, Sparkles, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
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
import { RestaurantMetaRow } from '@/entities/restaurant/ui'
import { ReviewCard } from '@/entities/review/ui'
import { Container } from '@/widgets/container'
import { cn } from '@/shared/lib/utils'
import { getRestaurant } from '@/entities/restaurant/api/restaurantApi'
import { getRestaurantReviews } from '@/entities/review/api/reviewApi'
import type { ReviewListItemDto } from '@/entities/review/model/dto'

export function RestaurantDetailPage() {
  const { id: restaurantId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = React.useState(false)
  const [restaurantData, setRestaurantData] = React.useState<{
    id: number
    name: string
    address: string
    foodCategories: string[]
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
    getRestaurant(Number(restaurantId))
      .then((res) => setRestaurantData(res.data))
      .catch(() => {})
  }, [restaurantId])

  const [previewReviews, setPreviewReviews] = React.useState<ReviewListItemDto[]>([])

  React.useEffect(() => {
    if (!restaurantId) return

    getRestaurantReviews(Number(restaurantId), { size: 3 })
      .then((res) => {
        const anyRes = res as {
          items?: ReviewListItemDto[]
          data?: { items?: ReviewListItemDto[] }
        }
        const items = anyRes.items ?? anyRes.data?.items
        if (items && items.length > 0) {
          setPreviewReviews(items.slice(0, 3))
        }
      })
      .catch(() => {})
  }, [restaurantId])

  const restaurant = (() => {
    if (!restaurantData) return null

    const positiveRatio = restaurantData.recommendStat?.positiveRatio
    const sentiment =
      typeof positiveRatio === 'number'
        ? {
            positive: positiveRatio,
            negative: Math.max(0, 100 - positiveRatio),
          }
        : { positive: 0, negative: 0 }

    const reviewCount = restaurantData.recommendStat
      ? restaurantData.recommendStat.recommendedCount +
        restaurantData.recommendStat.notRecommendedCount
      : 0

    const images =
      restaurantData.images && restaurantData.images.length > 0
        ? restaurantData.images.map((img) => img.url)
        : restaurantData.image?.url
          ? [restaurantData.image.url]
          : []

    return {
      id: String(restaurantData.id),
      name: restaurantData.name,
      category: restaurantData.foodCategories[0] ?? '',
      address: restaurantData.address,
      images,
      reviewCount,
      aiSummary: restaurantData.aiSummary ?? null,
      feature: restaurantData.aiFeatures ?? null,
      sentiment,
    }
  })()

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleWriteReview = () => {
    navigate(`/restaurants/${restaurantId}/review`)
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen">
        <TopAppBar showBackButton onBack={() => navigate(-1)} />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="pb-6">
      <TopAppBar showBackButton onBack={() => navigate(-1)} />

      {restaurant.images.length > 0 && (
        <div className="relative mb-4">
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

          <Button
            variant={isSaved ? 'default' : 'secondary'}
            size="icon"
            className="absolute top-4 right-4 rounded-full shadow-lg"
            onClick={handleSave}
          >
            <Heart className={cn('h-5 w-5', isSaved && 'fill-current')} />
          </Button>
        </div>
      )}

      <Container className="space-y-4 mb-6">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              {restaurant.category && (
                <p className="text-muted-foreground">{restaurant.category}</p>
              )}
              <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
            </div>
          </div>

          {restaurant.feature && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">AI 특징 요약</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{restaurant.feature}</p>
            </div>
          )}
        </div>
      </Container>

      <Tabs defaultValue="info" className="w-full">
        <Container>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="info">정보</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
          </TabsList>
        </Container>

        <TabsContent value="info" className="mt-4">
          <Container className="space-y-6">
            <Card className="divide-y overflow-hidden">
              <RestaurantMetaRow icon={MapPin} label="주소" value={restaurant.address} />
            </Card>
          </Container>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Container className="space-y-4">
            <Card className="p-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">총 {restaurant.reviewCount}개 리뷰</h2>
                  <p className="text-sm text-muted-foreground">
                    방문객들의 생생한 후기를 확인해보세요
                  </p>
                </div>
                <Button onClick={handleWriteReview}>리뷰 작성</Button>
              </div>

              <div className="space-y-2">
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
              </div>

              {restaurant.aiSummary && (
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-primary">리뷰 AI 요약</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {restaurant.aiSummary}
                  </p>
                </div>
              )}
            </Card>

            {previewReviews.length > 0 && (
              <div className="space-y-3">
                {previewReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}

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
