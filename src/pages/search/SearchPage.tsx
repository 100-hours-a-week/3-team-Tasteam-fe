import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/widgets/container'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'
import { Label } from '@/shared/ui/label'
import { Slider } from '@/shared/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { RestaurantCard } from '@/entities/restaurant/ui'
import { GroupCard } from '@/entities/group/ui'

type SearchPageProps = {
  onRestaurantClick?: (id: string) => void
  onGroupClick?: (id: string) => void
}

export function SearchPage({ onRestaurantClick, onGroupClick }: SearchPageProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState(['스시', '파스타', '강남역'])
  const [savedRestaurants, setSavedRestaurants] = useState<Record<string, boolean>>({})
  const [distance, setDistance] = useState([5])
  const [priceRange, setPriceRange] = useState('all')

  const recommendedKeywords = ['일식', '이탈리안', '한식', '카페', '디저트', '브런치']

  const searchResults = [
    {
      id: '1',
      name: '맛있는 스시 레스토랑',
      category: '일식',
      rating: 4.5,
      distance: '500m',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      tags: ['신선한 재료', '런치 세트'],
    },
    {
      id: '2',
      name: '정통 파스타 하우스',
      category: '이탈리안',
      rating: 4.7,
      distance: '1.2km',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
      tags: ['수제 파스타'],
    },
  ]

  const groupResults = [
    {
      id: '1',
      name: '회사 점심 모임',
      description: '매주 금요일 점심 메뉴 추천',
      memberCount: 8,
      memberAvatars: [
        { src: 'https://i.pravatar.cc/150?img=1', name: '김철수' },
        { src: 'https://i.pravatar.cc/150?img=2', name: '이영희' },
      ],
    },
  ]

  const removeRecentSearch = (keyword: string) => {
    setRecentSearches((prev) => prev.filter((k) => k !== keyword))
  }

  const handleSaveToggle = (id: string) => {
    setSavedRestaurants((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="pb-20">
      <TopAppBar title="검색" />
      <Container className="pt-4 pb-4 sticky top-14 bg-background z-10 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="음식점, 지역, 음식 종류 검색"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
              <SheetHeader className="px-6 pt-6">
                <SheetTitle>필터</SheetTitle>
                <SheetDescription>거리와 가격대를 선택해 검색 결과를 필터링하세요</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-6 pb-6 pt-2">
                <div className="space-y-4">
                  <Label className="text-base">거리</Label>
                  <div className="pt-2">
                    <Slider
                      value={distance}
                      onValueChange={setDistance}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-right">{distance[0]}km 이내</p>
                </div>
                <div className="space-y-4">
                  <Label className="text-base">가격대</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="low">1만원 이하</SelectItem>
                      <SelectItem value="medium">1-3만원</SelectItem>
                      <SelectItem value="high">3만원 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-6">
                  <Button variant="outline" className="flex-1 h-12 text-base">
                    초기화
                  </Button>
                  <Button className="flex-1 h-12 text-base">적용</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>

      {!searchQuery && (
        <Container className="space-y-4 pt-4">
          <div>
            <h3 className="mb-3 font-medium">최근 검색어</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((keyword, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="pl-3 pr-1 py-1.5 cursor-pointer hover:bg-secondary/80"
                >
                  {keyword}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-transparent"
                    onClick={() => removeRecentSearch(keyword)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-medium">추천 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {recommendedKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-accent">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      )}

      {searchQuery && (
        <Tabs defaultValue="restaurants" className="pt-4">
          <Container>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="restaurants">맛집</TabsTrigger>
              <TabsTrigger value="groups">그룹</TabsTrigger>
            </TabsList>
          </Container>

          <TabsContent value="restaurants" className="mt-4">
            <Container className="space-y-3">
              {searchResults.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  {...restaurant}
                  isSaved={savedRestaurants[restaurant.id]}
                  onSave={() => handleSaveToggle(restaurant.id)}
                  onClick={() => onRestaurantClick?.(restaurant.id)}
                />
              ))}
            </Container>
          </TabsContent>

          <TabsContent value="groups" className="mt-4">
            <Container className="space-y-3">
              {groupResults.map((group) => (
                <GroupCard key={group.id} {...group} onClick={() => onGroupClick?.(group.id)} />
              ))}
            </Container>
          </TabsContent>
        </Tabs>
      )}

      <BottomTabBar
        currentTab="search"
        onTabChange={(tab: TabId) => {
          if (tab === 'home') navigate(ROUTES.home)
          else if (tab === 'groups') navigate(ROUTES.groups)
          else if (tab === 'profile') navigate(ROUTES.profile)
        }}
      />
    </div>
  )
}
