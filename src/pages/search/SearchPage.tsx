import { useEffect, useRef, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/widgets/container'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
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
import { searchAll } from '@/entities/search/api/searchApi'
import { useRecentSearches } from '@/entities/search/model/useRecentSearches'
import { SearchGroupCarousel } from '@/features/search/SearchGroupCarousel'
import type { SearchGroupItem, SearchRestaurantItem } from '@/entities/search/model/types'

const SEARCH_DEBOUNCE_MS = 700

type SearchPageProps = {
  onRestaurantClick?: (id: string) => void
  onGroupClick?: (id: string) => void
}

export function SearchPage({ onRestaurantClick, onGroupClick }: SearchPageProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { recentSearches, remove: removeRecentSearch, add: addRecentSearch } = useRecentSearches()
  const [restaurantResults, setRestaurantResults] = useState<SearchRestaurantItem[]>([])
  const [groupResults, setGroupResults] = useState<SearchGroupItem[]>([])
  const [savedRestaurants, setSavedRestaurants] = useState<Record<string, boolean>>({})
  const [distance, setDistance] = useState([5])
  const [priceRange, setPriceRange] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchRequestId = useRef(0)
  const searchTimeoutId = useRef<number | null>(null)

  // TODO: 추천 키워드 기능 미개발 - 추후 활성화 예정
  // const recommendedKeywords = ['일식', '이탈리안', '한식', '카페', '디저트', '브런치']

  const handleSaveToggle = (id: string) => {
    setSavedRestaurants((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const scheduleSearch = (rawQuery: string) => {
    const keyword = rawQuery.trim()

    if (searchTimeoutId.current !== null) {
      window.clearTimeout(searchTimeoutId.current)
      searchTimeoutId.current = null
    }

    const requestId = ++searchRequestId.current

    if (!keyword) {
      setRestaurantResults([])
      setGroupResults([])
      setSearchError(null)
      setIsSearching(false)
      return
    }

    setRestaurantResults([])
    setGroupResults([])
    setIsSearching(true)
    setSearchError(null)

    searchTimeoutId.current = window.setTimeout(() => {
      addRecentSearch(keyword)
      searchAll({ keyword })
        .then((response) => {
          if (searchRequestId.current !== requestId) return
          setRestaurantResults(response.data.restaurants.items)
          setGroupResults(response.data.groups)
        })
        .catch(() => {
          if (searchRequestId.current !== requestId) return
          setRestaurantResults([])
          setGroupResults([])
          setSearchError('검색 중 오류가 발생했습니다.')
        })
        .finally(() => {
          if (searchRequestId.current === requestId) {
            setIsSearching(false)
          }
        })
    }, SEARCH_DEBOUNCE_MS)
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutId.current !== null) {
        window.clearTimeout(searchTimeoutId.current)
      }
      searchRequestId.current += 1
    }
  }, [])

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
              onChange={(e) => {
                const nextQuery = e.target.value
                setSearchQuery(nextQuery)
                scheduleSearch(nextQuery)
              }}
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
          {recentSearches.length > 0 && (
            <div>
              <h3 className="mb-3 font-medium">최근 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <Badge
                    key={item.id}
                    variant="secondary"
                    className="pl-3 pr-1 py-1.5 cursor-pointer hover:bg-secondary/80"
                    onClick={() => {
                      setSearchQuery(item.keyword)
                      scheduleSearch(item.keyword)
                    }}
                  >
                    {item.keyword}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={(event) => {
                        event.stopPropagation()
                        removeRecentSearch(item.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {/* TODO: 추천 키워드 기능 미개발 - 추후 활성화 예정
          <div>
            <h3 className="mb-3 font-medium">추천 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {recommendedKeywords.map((keyword, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSearchQuery(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          */}
        </Container>
      )}

      {searchQuery && (
        <div className="pt-4 space-y-6">
          {isSearching && (
            <Container>
              <p className="text-sm text-muted-foreground">검색 중...</p>
            </Container>
          )}
          {!isSearching && searchError && (
            <Container>
              <p className="text-sm text-destructive">{searchError}</p>
            </Container>
          )}
          {!isSearching && !searchError && (
            <>
              <div>
                <Container>
                  <h3 className="text-sm font-semibold mb-3">연관 그룹</h3>
                </Container>
                {groupResults.length > 0 ? (
                  <SearchGroupCarousel groups={groupResults} onGroupClick={onGroupClick} />
                ) : (
                  <Container className="flex flex-col items-center gap-3 py-6">
                    <p className="text-sm text-muted-foreground">찾으시는 그룹이 없습니다</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(ROUTES.createGroup)}
                    >
                      그룹 만들기
                    </Button>
                  </Container>
                )}
              </div>
              <div>
                <Container className="space-y-3">
                  <h3 className="text-sm font-semibold">연관 음식점</h3>
                  {restaurantResults.length > 0 ? (
                    restaurantResults.map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.restaurantId}
                        id={String(restaurant.restaurantId)}
                        name={restaurant.name}
                        category="음식점"
                        address={restaurant.address}
                        imageUrl={restaurant.imageUrl}
                        isSaved={savedRestaurants[String(restaurant.restaurantId)]}
                        onSave={() => handleSaveToggle(String(restaurant.restaurantId))}
                        onClick={() => onRestaurantClick?.(String(restaurant.restaurantId))}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      검색 결과가 없습니다
                    </p>
                  )}
                </Container>
              </div>
            </>
          )}
        </div>
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
