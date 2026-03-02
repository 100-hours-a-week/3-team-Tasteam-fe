import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/shared/ui/container'
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
  SheetClose,
} from '@/shared/ui/sheet'
import { Label } from '@/shared/ui/label'
import { Slider } from '@/shared/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { RestaurantCard } from '@/entities/restaurant'
import { searchAll } from '@/entities/search'
import { useRecentSearches } from '@/entities/search'
import { SearchGroupCarousel } from '@/features/search/SearchGroupCarousel'
import type { SearchGroupItem, SearchRestaurantItem } from '@/entities/search'
import { resolvePageContext, useUserActivity } from '@/entities/user-activity'

const SEARCH_DEBOUNCE_MS = 700
const SCROLL_DEBOUNCE_MS = 300
const DEFAULT_DISTANCE = 5
const DEFAULT_PRICE_RANGE = 'all'

const STORAGE_KEYS = {
  QUERY: 'search_state_query',
  RESTAURANTS: 'search_state_restaurants',
  GROUPS: 'search_state_groups',
  DISTANCE: 'search_state_distance',
  PRICE_RANGE: 'search_state_price_range',
  SCROLL: 'search_state_scroll',
} as const

type SearchPageProps = {
  onRestaurantClick?: (id: string, metadata?: { position: number }) => void
  onGroupClick?: (id: string, metadata?: { position: number }) => void
}

export function SearchPage({ onRestaurantClick, onGroupClick }: SearchPageProps) {
  const navigate = useNavigate()
  const { track } = useUserActivity()
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEYS.QUERY) || ''
  })
  const {
    recentSearches,
    remove: removeRecentSearch,
    add: addRecentSearch,
    refresh: refreshRecentSearches,
  } = useRecentSearches()
  const [restaurantResults, setRestaurantResults] = useState<SearchRestaurantItem[]>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.RESTAURANTS)
    return saved ? JSON.parse(saved) : []
  })
  const [groupResults, setGroupResults] = useState<SearchGroupItem[]>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.GROUPS)
    return saved ? JSON.parse(saved) : []
  })
  const [distance, setDistance] = useState<number[]>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.DISTANCE)
    return saved ? [parseFloat(saved)] : [DEFAULT_DISTANCE]
  })
  const [priceRange, setPriceRange] = useState<string>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.PRICE_RANGE) || DEFAULT_PRICE_RANGE
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchRequestId = useRef(0)
  const searchTimeoutId = useRef<number | null>(null)
  const scrollTimeoutId = useRef<number | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const hasGroupResults = groupResults.length > 0
  const hasRestaurantResults = restaurantResults.length > 0
  const hasNoResults = !hasGroupResults && !hasRestaurantResults
  const hasActiveFilters = distance[0] !== DEFAULT_DISTANCE || priceRange !== DEFAULT_PRICE_RANGE

  useLayoutEffect(() => {
    const savedScroll = sessionStorage.getItem(STORAGE_KEYS.SCROLL)
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10))
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutId.current !== null) {
        window.clearTimeout(scrollTimeoutId.current)
      }
      scrollTimeoutId.current = window.setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEYS.SCROLL, String(window.scrollY))
      }, SCROLL_DEBOUNCE_MS)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutId.current !== null) {
        window.clearTimeout(scrollTimeoutId.current)
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.QUERY, searchQuery)
  }, [searchQuery])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurantResults))
  }, [restaurantResults])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groupResults))
  }, [groupResults])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.DISTANCE, String(distance[0]))
  }, [distance])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.PRICE_RANGE, priceRange)
  }, [priceRange])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // TODO: 추천 키워드 기능 미개발 - 추후 활성화 예정
  // const recommendedKeywords = ['일식', '이탈리안', '한식', '카페', '디저트', '브런치']

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
      searchAll({
        keyword,
        distance: distance[0],
        priceRange: priceRange !== 'all' ? priceRange : undefined,
      })
        .then((response) => {
          if (searchRequestId.current !== requestId) return
          const nextRestaurants = response.data.restaurants.items
          const nextGroups = response.data.groups
          setRestaurantResults(nextRestaurants)
          setGroupResults(nextGroups)
          track({
            eventName: 'ui.search.executed',
            properties: {
              fromPageKey: resolvePageContext(window.location.pathname).pageKey,
              resultRestaurantCount: nextRestaurants.length,
              resultGroupCount: nextGroups.length,
              queryLength: keyword.length,
              hasFilter: hasActiveFilters,
            },
          })
          refreshRecentSearches()
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

  const handleResetFilters = () => {
    setDistance([DEFAULT_DISTANCE])
    setPriceRange(DEFAULT_PRICE_RANGE)
  }

  const handleApplyFilters = () => {
    if (searchQuery.trim()) {
      scheduleSearch(searchQuery)
    }
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
              ref={searchInputRef}
              placeholder="그룹, 음식점, 태그를 검색해보세요"
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
              <Button variant="outline" size="icon" className="relative">
                <SlidersHorizontal className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                )}
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
                  <Button
                    variant="outline"
                    className="flex-1 h-12 text-base"
                    onClick={handleResetFilters}
                  >
                    초기화
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1 h-12 text-base" onClick={handleApplyFilters}>
                      적용
                    </Button>
                  </SheetClose>
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
                    className="pl-3 pr-1 py-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setSearchQuery(item.keyword)
                      scheduleSearch(item.keyword)
                    }}
                  >
                    {item.keyword}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent text-primary-foreground"
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
              {hasNoResults ? (
                <Container className="py-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-semibold mb-2">검색 결과가 없습니다</h3>
                    <p className="text-sm text-muted-foreground">
                      다른 키워드로 다시 검색해보세요.
                    </p>
                  </div>
                </Container>
              ) : (
                <>
                  <div>
                    <Container>
                      <h3 className="text-sm font-semibold mb-3">연관 그룹</h3>
                    </Container>
                    {hasGroupResults ? (
                      <SearchGroupCarousel groups={groupResults} onGroupClick={onGroupClick} />
                    ) : (
                      <Container className="flex flex-col items-center gap-3 py-6">
                        <p className="text-sm text-muted-foreground">그룹 검색 결과가 없습니다</p>
                        {hasRestaurantResults && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(ROUTES.createGroup)}
                          >
                            그룹 만들기
                          </Button>
                        )}
                      </Container>
                    )}
                  </div>
                  <div>
                    <Container className="space-y-3">
                      <h3 className="text-sm font-semibold">연관 음식점</h3>
                      {hasRestaurantResults ? (
                        restaurantResults.map((restaurant, index) => (
                          <RestaurantCard
                            key={restaurant.restaurantId}
                            name={restaurant.name}
                            address={restaurant.address}
                            foodCategories={restaurant.foodCategories}
                            category={restaurant.category}
                            image={restaurant.imageUrl}
                            onClick={() =>
                              onRestaurantClick?.(String(restaurant.restaurantId), {
                                position: index,
                              })
                            }
                          />
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground py-6 text-center">
                          음식점 검색 결과가 없습니다
                        </p>
                      )}
                    </Container>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      <BottomTabBar
        currentTab="search"
        onTabChange={(tab: TabId) => {
          if (tab === 'home') navigate(ROUTES.home)
          else if (tab === 'favorites') navigate(ROUTES.favorites)
          else if (tab === 'groups') navigate(ROUTES.groups)
          else if (tab === 'profile') navigate(ROUTES.profile)
        }}
      />
    </div>
  )
}
