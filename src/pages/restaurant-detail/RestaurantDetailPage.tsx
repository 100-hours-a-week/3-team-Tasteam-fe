import { useState } from 'react'
import { Heart, Share2, UserPlus, MapPin, Clock, Phone, Star } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
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
import { cn } from '@/shared/lib/utils'

type RestaurantDetailPageProps = {
  restaurantId: string
  onBack?: () => void
  onWriteReview?: (restaurantId: string) => void
}

export function RestaurantDetailPage({
  restaurantId,
  onBack,
  onWriteReview,
}: RestaurantDetailPageProps) {
  const [isSaved, setIsSaved] = useState(false)

  const restaurant = {
    id: restaurantId,
    name: '맛있는 스시 레스토랑',
    category: '일식',
    rating: 4.5,
    reviewCount: 124,
    distance: '500m',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    hours: '11:00 - 22:00 (라스트오더 21:30)',
    tags: ['신선한 재료', '런치 세트', '예약 필수', '주차 가능'],
    images: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800',
      'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800',
    ],
    description:
      '신선한 재료로 만든 정통 일본식 스시를 제공합니다. 20년 경력의 셰프가 직접 준비하는 오마카세 코스가 인기입니다.',
  }

  const menu = [
    { name: '런치 세트', price: '15,000원', description: '사시미, 스시, 미소시루 포함' },
    { name: '오마카세 A', price: '50,000원', description: '셰프 추천 10가지 코스' },
    { name: '오마카세 B', price: '80,000원', description: '프리미엄 15가지 코스' },
    { name: '모둠 사시미', price: '35,000원', description: '제철 생선 모둠' },
  ]

  const reviews = [
    {
      id: '1',
      userName: '김철수',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '2024.01.20',
      content: '정말 신선하고 맛있었어요! 셰프님도 친절하시고 분위기도 좋았습니다.',
      images: ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'],
    },
    {
      id: '2',
      userName: '이영희',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4,
      date: '2024.01.18',
      content: '런치 세트가 가성비가 좋아요. 점심 시간에는 웨이팅이 있으니 예약 추천합니다.',
    },
  ]

  return (
    <div className="pb-6">
      <TopAppBar title={restaurant.name} showBackButton onBack={onBack} />

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
      </div>

      <Container className="space-y-4 mb-6">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="flex-1 text-xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-semibold">{restaurant.rating}</span>
              <span className="text-sm text-muted-foreground">({restaurant.reviewCount})</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-3">{restaurant.category}</p>
          <p className="text-sm leading-relaxed mb-4">{restaurant.description}</p>
          <div className="flex flex-wrap gap-2">
            {restaurant.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isSaved ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart className={cn('h-4 w-4 mr-2', isSaved && 'fill-current')} />
            {isSaved ? '저장됨' : '저장'}
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            공유
          </Button>
          <Button variant="outline" className="flex-1">
            <UserPlus className="h-4 w-4 mr-2" />
            그룹에 추가
          </Button>
        </div>
      </Container>

      <Tabs defaultValue="info" className="w-full">
        <Container>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="info">정보</TabsTrigger>
            <TabsTrigger value="menu">메뉴</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
          </TabsList>
        </Container>

        <TabsContent value="info" className="mt-4">
          <Container>
            <Card className="divide-y">
              <RestaurantMetaRow icon={MapPin} label="주소" value={restaurant.address} />
              <RestaurantMetaRow icon={Phone} label="전화번호" value={restaurant.phone} />
              <RestaurantMetaRow icon={Clock} label="영업시간" value={restaurant.hours} />
            </Card>
          </Container>
        </TabsContent>

        <TabsContent value="menu" className="mt-4">
          <Container className="space-y-3">
            {menu.map((item, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <span className="font-semibold text-primary shrink-0">{item.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </Container>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Container className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold">{restaurant.rating}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={cn(
                          'h-4 w-4',
                          idx < Math.floor(restaurant.rating)
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground',
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{restaurant.reviewCount}개의 리뷰</p>
              </div>
              <Button variant="outline" onClick={() => onWriteReview?.(restaurantId)}>
                리뷰 작성
              </Button>
            </div>
            {reviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </Container>
        </TabsContent>
      </Tabs>
    </div>
  )
}
