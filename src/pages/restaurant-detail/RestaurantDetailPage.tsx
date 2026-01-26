import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Heart,
  MapPin,
  Clock,
  Phone,
  Car,
  Wifi,
  Users,
  Cigarette,
  Calendar,
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
import { RestaurantMetaRow } from '@/entities/restaurant/ui'
import { ReviewCard } from '@/entities/review/ui'
import { Container } from '@/widgets/container'
import { cn } from '@/shared/lib/utils'

export function RestaurantDetailPage() {
  const { id: restaurantId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = React.useState(false)

  // Mock data - Enhanced with all details from design spec
  const restaurant = {
    id: restaurantId || '1',
    name: '맛있는 스시 레스토랑',
    category: '일식',
    rating: 4.5,
    reviewCount: 124,
    distance: '500m',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    hours: '11:00 - 22:00',
    breakTime: '15:00 - 17:00',
    lastOrder: '21:30',
    closedDays: '매주 월요일',
    website: 'www.sushi-restaurant.com',
    priceRange: '1인 20,000원 ~ 80,000원',
    parking: '발렛파킹 가능 (2시간 무료)',
    reservationAvailable: true,
    tags: ['신선한 재료', '런치 세트', '예약 필수', '주차 가능'],
    images: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800',
      'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800',
    ],
    feature:
      '강남역 인근에서 드문 20년 경력 셰프의 정통 오마카세를 합리적인 가격에 즐길 수 있는 곳입니다. 특히 계절별로 엄선된 제철 생선의 신선도가 다른 곳보다 월등하다는 평가를 받습니다.',
    facilities: [
      { name: '와이파이', icon: Wifi, available: true },
      { name: '주차', icon: Car, available: true },
      { name: '단체석', icon: Users, available: true },
      { name: '금연', icon: Cigarette, available: false },
      { name: '예약', icon: Calendar, available: true },
    ],
    aiSummary:
      '많은 방문객들이 신선한 네타와 셰프의 전문성을 높게 평가하고 있습니다. 특히 런치 세트의 가성비가 뛰어나며, 오마카세는 특별한 날 방문하기 좋다는 의견이 많습니다. 전반적으로 깔끔한 분위기와 친절한 서비스가 돋보이는 곳입니다.',
    sentiment: {
      positive: 92,
      negative: 8,
    },
  }

  const reviews = [
    {
      id: '1',
      userName: '김철수',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '2024.01.20',
      content:
        '정말 신선하고 맛있었어요! 셰프님도 친절하시고 분위기도 좋았습니다. 다음에 또 방문하고 싶네요.',
      images: ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'],
      helpful: 24,
    },
    {
      id: '2',
      userName: '이영희',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4,
      date: '2024.01.18',
      content: '런치 세트가 가성비가 좋아요. 점심 시간에는 웨이팅이 있으니 예약 추천합니다.',
      helpful: 18,
    },
    {
      id: '3',
      userName: '박민수',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      date: '2024.01.15',
      content: '오마카세 B 코스를 먹었는데 정말 훌륭했습니다. 특히 참치가 일품이었어요!',
      images: [
        'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400',
        'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400',
      ],
      helpful: 32,
    },
  ]

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

        {/* Floating Save Button */}
        <Button
          variant={isSaved ? 'default' : 'secondary'}
          size="icon"
          className="absolute top-4 right-4 rounded-full shadow-lg"
          onClick={handleSave}
        >
          <Heart className={cn('h-5 w-5', isSaved && 'fill-current')} />
        </Button>
      </div>

      {/* Restaurant Info */}
      <Container className="space-y-4 mb-6">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <p className="text-muted-foreground">{restaurant.category}</p>
              <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
            </div>
          </div>

          {/* Restaurant Feature - AI Highlighted */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">AI 특징 요약</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{restaurant.feature}</p>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">영업시간</span>
                  <span>{restaurant.hours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">브레이크타임</span>
                  <span>{restaurant.breakTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">라스트오더</span>
                  <span>{restaurant.lastOrder}</span>
                </div>
                <div className="flex justify-between border-t pt-3 mt-1">
                  <span className="text-muted-foreground">정기휴무</span>
                  <span className="text-destructive font-medium">{restaurant.closedDays}</span>
                </div>
              </div>
            </Card>

            {/* Contact & Location */}
            <Card className="divide-y overflow-hidden">
              <RestaurantMetaRow icon={MapPin} label="주소" value={restaurant.address} />
              <RestaurantMetaRow icon={Phone} label="전화번호" value={restaurant.phone} />
            </Card>
          </Container>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Container className="space-y-4">
            {/* AI Review Summary & Sentiment */}
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

              {/* Sentiment Bar - Added as per request */}
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

              {/* AI Summary - Added as per request */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-primary">리뷰 AI 요약</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {restaurant.aiSummary}
                </p>
              </div>
            </Card>

            {/* Review List */}
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  userName={review.userName}
                  userAvatar={review.userAvatar}
                  date={review.date}
                  content={review.content}
                  images={review.images}
                />
              ))}
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
