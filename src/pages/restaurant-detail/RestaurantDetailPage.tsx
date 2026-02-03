import React, { useRef, useEffect } from 'react'
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
import { GroupCategoryFilter } from '@/features/groups'
import { getRestaurant, getRestaurantMenus } from '@/entities/restaurant/api/restaurantApi'
import { getRestaurantReviews } from '@/entities/review/api/reviewApi'
import type { ReviewListItemDto } from '@/entities/review/model/dto'
import type { MenuCategoryDto } from '@/entities/restaurant/model/dto'

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
    phoneNumber?: string | null
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
  const [isMenusLoading, setIsMenusLoading] = React.useState(true)
  const [menusError, setMenusError] = React.useState(false)
  const [menuCategories, setMenuCategories] = React.useState<MenuCategoryDto[]>([])
  const [selectedMenuCategory, setSelectedMenuCategory] = React.useState<string | null>(null)
  const [showAllMenuCategoryButtons, setShowAllMenuCategoryButtons] = React.useState(false)
  const [expandedMenuCategoryIds, setExpandedMenuCategoryIds] = React.useState<Set<number>>(
    () => new Set(),
  )
  const menuCategoryRefsMap = useRef<Record<number, HTMLDivElement | null>>({})

  const MENU_CATEGORY_FOLD_LIMIT = 6
  const MENU_ITEM_FOLD_LIMIT = 6
  const displayedMenuCategories =
    menuCategories.length > MENU_CATEGORY_FOLD_LIMIT && !showAllMenuCategoryButtons
      ? menuCategories.slice(0, MENU_CATEGORY_FOLD_LIMIT)
      : menuCategories
  const hasMoreMenuCategories =
    menuCategories.length > MENU_CATEGORY_FOLD_LIMIT && !showAllMenuCategoryButtons

  // 스크롤 시 보이는 카테고리에 맞춰 상단 버튼 선택 갱신
  useEffect(() => {
    if (displayedMenuCategories.length === 0) return
    const refs = menuCategoryRefsMap.current
    const elements = displayedMenuCategories
      .map((c) => refs[c.id])
      .filter((el): el is HTMLDivElement => el != null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const topmost = intersecting[0]
        if (!topmost) return
        const idStr = (topmost.target as HTMLElement).dataset.categoryId
        if (idStr == null) return
        const id = Number(idStr)
        const cat = menuCategories.find((c) => c.id === id)
        if (cat) setSelectedMenuCategory(cat.name)
      },
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [displayedMenuCategories, menuCategories])

  React.useEffect(() => {
    if (!restaurantId) return
    setIsReviewsLoading(true)
    setReviewsError(false)
    getRestaurantReviews(Number(restaurantId), { size: 3 })
      .then((res) => {
        const anyRes = res as {
          items?: ReviewListItemDto[]
          data?: { items?: ReviewListItemDto[] }
        }
        const items = anyRes.items ?? anyRes.data?.items
        setPreviewReviews(items?.slice(0, 3) ?? [])
      })
      .catch(() => {
        setPreviewReviews([])
        setReviewsError(true)
      })
      .finally(() => setIsReviewsLoading(false))
  }, [restaurantId])

  React.useEffect(() => {
    if (!restaurantId) return
    setIsMenusLoading(true)
    setMenusError(false)
    getRestaurantMenus(Number(restaurantId), {
      includeEmptyCategories: false,
      recommendedFirst: true,
    })
      .then((res) => {
        const raw = res as {
          data?: { categories?: MenuCategoryDto[] }
          categories?: MenuCategoryDto[]
        }
        setMenuCategories(raw.data?.categories ?? raw.categories ?? [])
      })
      .catch(() => {
        setMenuCategories([])
        setMenusError(true)
      })
      .finally(() => setIsMenusLoading(false))
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
      phone: restaurantData.phoneNumber ?? baseRestaurant.phone,
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

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return '가격 정보 없음'
    return `${price.toLocaleString('ko-KR')}원`
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
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="info">정보</TabsTrigger>
            <TabsTrigger value="menus">메뉴</TabsTrigger>
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
            <Card className="divide-y overflow-hidden pt-3 pb-3">
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
                    className="pb-0"
                  />
                  <RestaurantMetaRow
                    icon={Phone}
                    label="전화번호"
                    value={restaurant.phone || '정보 없음'}
                    className="pt-4"
                  />
                </>
              )}
            </Card>
            <p className="text-xs text-muted-foreground text-center pt-2 pb-2">
              실제 영업시간과 매장 정보는 매장 상황에 따라 다를 수 있습니다.
            </p>
          </Container>
        </TabsContent>

        <TabsContent value="menus" className="mt-4">
          <Container className="space-y-4">
            {menuCategories.length > 0 && (
              <div className="sticky top-14 z-10 -mx-4 px-4 py-2 bg-background flex items-center gap-2">
                <div className="flex-1 min-w-0 overflow-x-auto">
                  <GroupCategoryFilter
                    categories={displayedMenuCategories.map((c) => c.name)}
                    value={selectedMenuCategory ?? menuCategories[0]?.name ?? ''}
                    onChange={(name) => {
                      setSelectedMenuCategory(name)
                      const cat = menuCategories.find((c) => c.name === name)
                      if (cat)
                        menuCategoryRefsMap.current[cat.id]?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                    }}
                  />
                </div>
              </div>
            )}
            {isMenusLoading && menuCategories.length === 0 ? (
              <>
                <Card className="p-4 space-y-3">
                  <Skeleton className="h-5 w-28" />
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </div>
                  </div>
                </Card>
                <Card className="p-4 space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-52" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </div>
                  </div>
                </Card>
              </>
            ) : menusError && menuCategories.length === 0 ? (
              <Card className="p-4 text-sm text-muted-foreground">메뉴를 불러오지 못했습니다.</Card>
            ) : menuCategories.length > 0 ? (
              <>
                {displayedMenuCategories.map((category) => (
                  <div
                    key={category.id}
                    data-category-id={category.id}
                    ref={(el) => {
                      menuCategoryRefsMap.current[category.id] = el
                    }}
                  >
                    <Card className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">{category.name}</h3>
                      </div>
                      {category.menus.length > 0 ? (
                        <div className="space-y-0">
                          <div className="divide-y divide-border">
                            {(expandedMenuCategoryIds.has(category.id) ||
                            category.menus.length <= MENU_ITEM_FOLD_LIMIT
                              ? category.menus
                              : category.menus.slice(0, MENU_ITEM_FOLD_LIMIT)
                            ).map((menu) => (
                              <div
                                key={menu.id}
                                className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                              >
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{menu.name}</p>
                                    {menu.isRecommended && (
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                                        추천
                                      </span>
                                    )}
                                  </div>
                                  {menu.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {menu.description}
                                    </p>
                                  )}
                                  <p className="text-sm font-semibold">{formatPrice(menu.price)}</p>
                                </div>
                                {menu.imageUrl ? (
                                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                    <img
                                      src={menu.imageUrl}
                                      alt={menu.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                          {category.menus.length > MENU_ITEM_FOLD_LIMIT &&
                            !expandedMenuCategoryIds.has(category.id) && (
                              <div className="pt-3">
                                <button
                                  type="button"
                                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border"
                                  onClick={() =>
                                    setExpandedMenuCategoryIds((prev) =>
                                      new Set(prev).add(category.id),
                                    )
                                  }
                                >
                                  더보기
                                </button>
                              </div>
                            )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">등록된 메뉴가 없습니다.</p>
                      )}
                    </Card>
                  </div>
                ))}
                {hasMoreMenuCategories && (
                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border bg-muted/30 hover:bg-muted/50"
                      onClick={() => setShowAllMenuCategoryButtons(true)}
                    >
                      더보기
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Card className="p-4 text-sm text-muted-foreground">등록된 메뉴가 없습니다.</Card>
            )}
            <p className="text-xs text-muted-foreground text-center pt-4 pb-2">
              실제 메뉴와 가격은 매장 상황에 따라 다를 수 있습니다.
            </p>
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
