import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Input } from '@/shared/ui/input'
import { RestaurantCard } from '@/entities/restaurant/ui'
import { GroupCard } from '@/entities/group/ui'
import { ROUTES } from '@/shared/config/routes'
import { getMainPage } from '@/entities/main/api/mainApi'
import type { MainResponse } from '@/entities/main/model/types'

type HomePageProps = {
  onSearchClick?: () => void
  onRestaurantClick?: (id: string) => void
  onGroupClick?: (id: string) => void
}

const defaultRestaurants = [
  {
    id: '1',
    name: '맛있는 스시 레스토랑',
    category: '일식',
    rating: 4.5,
    distance: '500m',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    tags: ['신선한 재료', '런치 세트', '예약 필수'],
  },
  {
    id: '2',
    name: '정통 파스타 하우스',
    category: '이탈리안',
    rating: 4.7,
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    tags: ['수제 파스타', '와인 페어링'],
  },
  {
    id: '3',
    name: '강남 BBQ',
    category: '한식',
    rating: 4.3,
    distance: '800m',
    image: 'https://images.unsplash.com/photo-1588347818036-891e9c90c08d?w=800',
    tags: ['고급 한우', '개별 룸'],
  },
]

const defaultGroups = [
  {
    id: '1',
    name: '회사 점심 모임',
    description: '매주 금요일 점심 메뉴 추천',
    memberCount: 8,
    memberAvatars: [
      { src: 'https://i.pravatar.cc/150?img=1', name: '김철수' },
      { src: 'https://i.pravatar.cc/150?img=2', name: '이영희' },
      { src: 'https://i.pravatar.cc/150?img=3', name: '박민수' },
    ],
    status: '활성',
  },
  {
    id: '2',
    name: '강남 맛집 탐험대',
    description: '강남 지역 숨은 맛집을 찾아서',
    memberCount: 15,
    memberAvatars: [
      { src: 'https://i.pravatar.cc/150?img=4', name: '최지훈' },
      { src: 'https://i.pravatar.cc/150?img=5', name: '정수연' },
    ],
  },
]

export function HomePage({ onSearchClick, onRestaurantClick, onGroupClick }: HomePageProps) {
  const navigate = useNavigate()
  const [savedRestaurants, setSavedRestaurants] = useState<Record<string, boolean>>({})
  const [mainData, setMainData] = useState<MainResponse | null>(null)

  useEffect(() => {
    getMainPage({ latitude: 37.5, longitude: 127.0 })
      .then(setMainData)
      .catch(() => {})
  }, [])

  const recommendedRestaurants =
    mainData?.data?.sections?.[0]?.items?.map((item) => ({
      id: String(item.restaurantId),
      name: item.name,
      category: item.category,
      rating: 4.5,
      distance: `${item.distanceMeter}m`,
      image: item.thumbnailImageUrl,
      tags: [],
    })) ?? defaultRestaurants

  const myGroups = defaultGroups

  const handleSaveToggle = (id: string) => {
    setSavedRestaurants((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick()
    } else {
      navigate('/search')
    }
  }

  return (
    <div className="pb-20">
      <TopAppBar title="Tasteam" />
      <Container className="pt-4 pb-6">
        <div className="relative" onClick={handleSearchClick}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="음식점, 지역, 음식 종류 검색"
            className="pl-9 bg-secondary"
            readOnly
          />
        </div>
      </Container>

      <section className="space-y-4 mb-8">
        <Container>
          <h2 className="text-lg font-semibold">추천 맛집</h2>
        </Container>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4">
            {recommendedRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="w-[280px] shrink-0">
                <RestaurantCard
                  id={restaurant.id}
                  name={restaurant.name}
                  category={restaurant.category}
                  rating={restaurant.rating}
                  distance={restaurant.distance}
                  image={restaurant.image}
                  tags={restaurant.tags}
                  isSaved={savedRestaurants[restaurant.id]}
                  onSave={() => handleSaveToggle(restaurant.id)}
                  onClick={() => onRestaurantClick?.(restaurant.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4 mb-8">
        <Container>
          <h2 className="text-lg font-semibold">내 그룹</h2>
        </Container>
        <Container className="space-y-3">
          {myGroups.map((group) => (
            <GroupCard key={group.id} {...group} onClick={() => onGroupClick?.(group.id)} />
          ))}
        </Container>
      </section>

      <section className="space-y-4">
        <Container>
          <h2 className="text-lg font-semibold">최근 본 맛집</h2>
        </Container>
        <Container className="space-y-3">
          {recommendedRestaurants.slice(0, 2).map((restaurant) => (
            <RestaurantCard
              key={`recent-${restaurant.id}`}
              id={restaurant.id}
              name={restaurant.name}
              category={restaurant.category}
              rating={restaurant.rating}
              distance={restaurant.distance}
              image={restaurant.image}
              tags={restaurant.tags}
              isSaved={savedRestaurants[restaurant.id]}
              onSave={() => handleSaveToggle(restaurant.id)}
              onClick={() => onRestaurantClick?.(restaurant.id)}
            />
          ))}
        </Container>
      </section>

      <BottomTabBar
        currentTab="home"
        onTabChange={(tab: TabId) => {
          if (tab === 'search') navigate(ROUTES.search)
          else if (tab === 'groups') navigate(ROUTES.groups)
          else if (tab === 'profile') navigate(ROUTES.profile)
        }}
      />
    </div>
  )
}
