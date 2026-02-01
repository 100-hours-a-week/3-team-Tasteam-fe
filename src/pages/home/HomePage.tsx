import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Flame, Sparkles } from 'lucide-react'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { Container } from '@/widgets/container'
import { LocationHeader } from '@/widgets/location-header'
import { HeroRecommendationCard } from '@/widgets/hero-recommendation'
import { HorizontalRestaurantCard, VerticalRestaurantCard } from '@/widgets/restaurant-card'
import { Input } from '@/shared/ui/input'
import { ROUTES } from '@/shared/config/routes'
import { getMainPage } from '@/entities/main/api/mainApi'
import { useAppLocation } from '@/entities/location'
import { getGeolocationPermissionState } from '@/shared/lib/geolocation'
import type { MainResponse, MainSection, MainSectionItem } from '@/entities/main/model/types'

type HomePageProps = {
  onSearchClick?: () => void
  onRestaurantClick?: (id: string) => void
  onGroupClick?: (id: string) => void
}

type DummyRestaurant = {
  id: number
  name: string
  category: string
  address?: string
  rating: number
  distance: string
  image: string
  tags: string[]
  reason?: string
}

const dummyNewRestaurants: DummyRestaurant[] = [
  {
    id: 1,
    name: '베이커리 카페 온',
    category: '카페',
    address: '강남구 역삼동',
    rating: 4.6,
    distance: '200m',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    tags: ['도보 5분', '지금 열림'],
  },
  {
    id: 2,
    name: '테이스티 라멘',
    category: '일식',
    address: '강남구 역삼동',
    rating: 4.4,
    distance: '350m',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    tags: ['웨이팅 적음', '지금 열림'],
  },
  {
    id: 3,
    name: '더 스테이크 하우스',
    category: '양식',
    address: '강남구 역삼동',
    rating: 4.8,
    distance: '600m',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800',
    tags: ['주차 가능', '지금 열림'],
  },
]

const dummyHotRestaurants: DummyRestaurant[] = [
  {
    id: 4,
    name: '맛있는 스시 레스토랑',
    category: '일식',
    address: '강남구 역삼동',
    rating: 4.5,
    distance: '500m',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    tags: ['신선한 재료', '런치 세트', '예약 필수'],
    reason: '당신이 좋아하는 일식',
  },
  {
    id: 5,
    name: '정통 파스타 하우스',
    category: '이탈리안',
    address: '강남구 역삼동',
    rating: 4.7,
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    tags: ['수제 파스타', '와인 페어링'],
    reason: '가성비 좋은 이탈리안',
  },
  {
    id: 6,
    name: '강남 BBQ',
    category: '한식',
    address: '강남구 역삼동',
    rating: 4.3,
    distance: '800m',
    image: 'https://images.unsplash.com/photo-1588347818036-891e9c90c08d?w=800',
    tags: ['고급 한우', '개별 룸'],
    reason: '분위기 좋은 한식당',
  },
]

function formatDistance(meter: number): string {
  if (meter < 1000) return `${meter}m`
  return `${(meter / 1000).toFixed(1)}km`
}

export function HomePage({ onSearchClick, onRestaurantClick }: HomePageProps) {
  const navigate = useNavigate()
  const [mainData, setMainData] = useState<MainResponse | null>(null)
  const { location, status, requestCurrentLocation } = useAppLocation()
  const hasRefreshedRef = useRef(false)
  const latitude = location?.latitude ?? 37.5665
  const longitude = location?.longitude ?? 126.978

  useEffect(() => {
    getMainPage({ latitude, longitude })
      .then(setMainData)
      .catch(() => {})
  }, [latitude, longitude])

  useEffect(() => {
    if (hasRefreshedRef.current) return
    if (status === 'loading') return

    hasRefreshedRef.current = true
    void (async () => {
      const permission = await getGeolocationPermissionState()
      if (permission !== 'granted') return
      queueMicrotask(() => {
        void requestCurrentLocation()
      })
    })()
  }, [requestCurrentLocation, status])

  const newSection = mainData?.data?.sections?.find((s: MainSection) => s.type === 'NEW')
  const hotSection = mainData?.data?.sections?.find((s: MainSection) => s.type === 'HOT')

  const newItems: DummyRestaurant[] = newSection?.items?.length
    ? newSection.items.map((item: MainSectionItem) => ({
        id: item.restaurantId,
        name: item.name,
        category: item.category,
        rating: 4.5,
        distance: formatDistance(item.distanceMeter),
        image: item.thumbnailImageUrl,
        tags: [],
      }))
    : dummyNewRestaurants

  const hotItems: DummyRestaurant[] = hotSection?.items?.length
    ? hotSection.items.map((item: MainSectionItem) => ({
        id: item.restaurantId,
        name: item.name,
        category: item.category,
        rating: 4.5,
        distance: formatDistance(item.distanceMeter),
        image: item.thumbnailImageUrl,
        tags: [],
        reason: item.reviewSummary,
      }))
    : dummyHotRestaurants

  return (
    <div className="pb-20">
      <LocationHeader
        district={status === 'loading' ? '현재 위치 확인 중...' : location?.district}
        address={location?.address}
      />

      <Container className="py-4">
        <div
          className="relative cursor-pointer"
          onClick={() => {
            if (onSearchClick) {
              onSearchClick()
              return
            }
            navigate(ROUTES.search)
          }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="메뉴, 가게, 태그 검색"
            className="pl-9 bg-background border"
            readOnly
          />
        </div>
      </Container>

      <section className="mb-8">
        <Container>
          <HeroRecommendationCard
            title="오늘 점심 뭐먹지?"
            description="AI가 추천하는 맞춤 맛집을 확인해보세요"
            image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
            onCTAClick={() => navigate(ROUTES.todayLunch)}
          />
        </Container>
      </section>

      {/* QuickActions - 추후 기능 추가 시 활성화
      <section className="mb-8">
        <Container>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.action}
                icon={action.icon}
                label={action.label}
                onClick={() => handleQuickAction(action.action)}
              />
            ))}
          </div>
        </Container>
      </section>
      */}

      {/* CategoryChips - 추후 기능 추가 시 활성화
      <section className="mb-8">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4">
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.label}
                icon={<span className="text-sm">{category.icon}</span>}
                isActive={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>
      </section>
      */}

      <section className="mb-8">
        <Container className="mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">신규 개장</h2>
          </div>
        </Container>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex w-max gap-3 px-4">
            {newItems.map((item) => (
              <div key={item.id} className="w-[260px] shrink-0">
                <HorizontalRestaurantCard
                  id={item.id}
                  name={item.name}
                  category={item.category}
                  address={item.address}
                  rating={item.rating}
                  distance={item.distance}
                  image={item.image}
                  tags={item.tags}
                  onClick={onRestaurantClick}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <Container className="mb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">HOT 플레이스</h2>
          </div>
        </Container>
        <Container>
          <div className="space-y-4">
            {hotItems.map((item) => (
              <VerticalRestaurantCard
                key={item.id}
                id={item.id}
                name={item.name}
                category={item.category}
                address={item.address}
                rating={item.rating}
                distance={item.distance}
                image={item.image}
                tags={item.tags}
                reason={item.reason}
                onClick={onRestaurantClick}
              />
            ))}
          </div>
        </Container>
      </section>

      <BottomTabBar
        currentTab="home"
        onTabChange={(tab: TabId) => {
          if (tab === 'search') {
            if (onSearchClick) {
              onSearchClick()
              return
            }
            navigate(ROUTES.search)
          } else if (tab === 'groups') {
            navigate(ROUTES.groups)
          } else if (tab === 'profile') {
            navigate(ROUTES.profile)
          }
        }}
      />
    </div>
  )
}
