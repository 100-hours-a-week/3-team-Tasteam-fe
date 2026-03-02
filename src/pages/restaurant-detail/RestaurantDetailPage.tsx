import React, { useRef, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Heart,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  DollarSign,
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel'
import { Skeleton } from '@/shared/ui/skeleton'
import { RestaurantMetaRow } from '@/entities/restaurant'
import { DetailReviewCard } from '@/entities/review'
import { Container } from '@/shared/ui/container'
import { cn } from '@/shared/lib/utils'
import { GroupCategoryFilter } from '@/features/groups'
import { getRestaurant, getRestaurantMenus } from '@/entities/restaurant'
import { restaurantKeys } from '@/entities/restaurant/model/restaurantKeys'
import { getRestaurantReviews } from '@/entities/review'
import { reviewKeys } from '@/entities/review/model/reviewKeys'
import { getRestaurantFavoriteTargets } from '@/entities/favorite'
import { favoriteKeys } from '@/entities/favorite/model/favoriteKeys'
import { FavoriteSelectionSheet } from '@/features/favorites'
import { toast } from 'sonner'
import { ROUTES } from '@/shared/config/routes'
import type { ReviewListItemDto } from '@/entities/review'
import type {
  MenuCategoryDto,
  AiCategorySummaryDto,
  AiCategoryComparisonDto,
  AiEvidenceDto,
} from '@/entities/restaurant'
import { useAuth } from '@/entities/user'
import { useMemberGroups } from '@/entities/member'
import { resolvePageContext, useUserActivity } from '@/entities/user-activity'
import { AlertDialog } from '@/shared/ui/alert-dialog'
import { ConfirmAlertDialogContent } from '@/shared/ui/confirm-alert-dialog'
import { STALE_CONTENT, STALE_USER } from '@/shared/lib/queryConstants'

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
  const location = useLocation()
  const { track } = useUserActivity()
  const { isAuthenticated } = useAuth()
  const { summaries } = useMemberGroups()
  const currentPageKey = resolvePageContext(location.pathname).pageKey
  const locationState = (location.state as { fromPageKey?: string } | null) ?? null
  const fromPageKey = locationState?.fromPageKey ?? currentPageKey
  const parsedRestaurantId = Number(restaurantId)
  const qc = useQueryClient()
  const [showLoginModal, setShowLoginModal] = React.useState(false)
  const [showGroupJoinModal, setShowGroupJoinModal] = React.useState(false)
  const [showFavoriteSheet, setShowFavoriteSheet] = React.useState(false)

  // 식당 상세 조회
  const { data: restaurantRes, isLoading: isRestaurantLoading } = useQuery({
    queryKey: restaurantKeys.detail(parsedRestaurantId),
    queryFn: () => getRestaurant(parsedRestaurantId),
    enabled: Boolean(restaurantId),
    staleTime: STALE_CONTENT,
  })

  const restaurantData = restaurantRes?.data ?? null

  // 뷰 이벤트 트래킹 (restaurant 데이터 로드 후)
  useEffect(() => {
    if (restaurantData && Number.isFinite(parsedRestaurantId)) {
      track({
        eventName: 'ui.restaurant.viewed',
        properties: { restaurantId: parsedRestaurantId, fromPageKey },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantData])

  // 404 리다이렉트
  useEffect(() => {
    if (!isRestaurantLoading && !restaurantData && restaurantId) {
      navigate('/404', { replace: true })
    }
  }, [isRestaurantLoading, restaurantData, restaurantId, navigate])

  // 찜 상태 조회
  const { data: favoriteTargetsRes } = useQuery({
    queryKey: favoriteKeys.restaurantTargets(parsedRestaurantId),
    queryFn: () => getRestaurantFavoriteTargets(parsedRestaurantId),
    enabled: isAuthenticated && Boolean(restaurantId),
    staleTime: STALE_USER,
  })

  const favoriteStatus = React.useMemo(() => {
    if (!favoriteTargetsRes?.data) return null
    const data = favoriteTargetsRes.data
    const myTarget = data.targets.find((t: any) => t.targetType === 'ME')
    const subgroupTargets = data.targets.filter((t: any) => t.targetType === 'SUBGROUP')
    return {
      personal: myTarget?.favoriteState === 'FAVORITED',
      subgroups: subgroupTargets.map((st: any) => ({
        subgroupId: st.targetId || 0,
        isFavorited: st.favoriteState === 'FAVORITED',
      })),
    }
  }, [favoriteTargetsRes])

  // 리뷰 초기 조회
  const { data: reviewsRes, isLoading: isReviewsLoading } = useQuery({
    queryKey: reviewKeys.byRestaurant(parsedRestaurantId, { size: 10 }),
    queryFn: () => getRestaurantReviews(parsedRestaurantId, { size: 10 }),
    enabled: Boolean(restaurantId),
    staleTime: STALE_CONTENT,
  })
  const [additionalReviews, setAdditionalReviews] = React.useState<ReviewListItemDto[]>([])
  const [reviewsNextCursor, setReviewsNextCursor] = React.useState<string | null>(() => null)
  const [hasMoreReviews, setHasMoreReviews] = React.useState(false)
  const [isLoadingMoreReviews, setIsLoadingMoreReviews] = React.useState(false)

  // reviewsRes가 업데이트되면 cursor 상태 동기화
  useEffect(() => {
    if (!reviewsRes) return
    const anyRes = reviewsRes as {
      items?: ReviewListItemDto[]
      pagination?: { nextCursor: string | null; hasNext: boolean }
    }
    setReviewsNextCursor(anyRes.pagination?.nextCursor ?? null)
    setHasMoreReviews(Boolean(anyRes.pagination?.hasNext))
    setAdditionalReviews([])
  }, [reviewsRes])

  const initialReviews: ReviewListItemDto[] = (() => {
    if (!reviewsRes) return []
    const anyRes = reviewsRes as {
      items?: ReviewListItemDto[]
      data?: { items?: ReviewListItemDto[] }
    }
    return anyRes.items ?? anyRes.data?.items ?? []
  })()
  const reviews = [...initialReviews, ...additionalReviews]

  // 메뉴 조회
  const {
    data: menusRes,
    isLoading: isMenusLoading,
    isError: isMenusError,
  } = useQuery({
    queryKey: restaurantKeys.menus(parsedRestaurantId),
    queryFn: () =>
      getRestaurantMenus(parsedRestaurantId, {
        includeEmptyCategories: false,
        recommendedFirst: true,
      }),
    enabled: Boolean(restaurantId),
    staleTime: STALE_CONTENT,
  })
  const menusError = isMenusError
  const menuCategories: MenuCategoryDto[] = (() => {
    if (!menusRes) return []
    const raw = menusRes as {
      data?: { categories?: MenuCategoryDto[] }
      categories?: MenuCategoryDto[]
    }
    return raw.data?.categories ?? raw.categories ?? []
  })()

  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState<number | null>(null)
  const [activeDetailTab, setActiveDetailTab] = React.useState('info')
  const [expandedMenuCategoryIndices, setExpandedMenuCategoryIndices] = React.useState<Set<number>>(
    () => new Set(),
  )
  const menuCategoryRefsMap = useRef<Record<number, HTMLDivElement | null>>({})
  const evidenceScrollRef = useRef<HTMLDivElement>(null)
  const reviewObserverRef = useRef<IntersectionObserver | null>(null)

  const MENU_ITEM_FOLD_LIMIT = 6

  // 스크롤 시 보이는 카테고리에 맞춰 상단 버튼 선택 갱신 (스크롤 기준으로 현재 섹션 계산)
  const STICKY_BAR_BOTTOM = 120
  useEffect(() => {
    if (activeDetailTab !== 'menus' || menuCategories.length === 0) return

    const refs = menuCategoryRefsMap.current
    let rafId = 0

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const withTop = menuCategories
          .map((_, idx) => {
            const el = refs[idx]
            if (!el) return null
            return { index: idx, top: el.getBoundingClientRect().top }
          })
          .filter((x): x is { index: number; top: number } => x != null)

        if (withTop.length === 0) return

        withTop.sort((a, b) => a.top - b.top)
        const pastLine = withTop.filter((x) => x.top <= STICKY_BAR_BOTTOM)
        const currentIndex =
          pastLine.length > 0 ? pastLine[pastLine.length - 1].index : withTop[0].index
        setSelectedCategoryIndex(currentIndex)
      })
    }

    const initTimer = setTimeout(() => {
      onScroll()
    }, 100)

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(initTimer)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [activeDetailTab, menuCategories])

  const loadMoreReviews = React.useCallback(async () => {
    if (!restaurantId || isReviewsLoading || isLoadingMoreReviews || !hasMoreReviews) return

    setIsLoadingMoreReviews(true)
    try {
      const res = await getRestaurantReviews(Number(restaurantId), {
        cursor: reviewsNextCursor ?? undefined,
        size: 10,
      })
      const anyRes = res as {
        items?: ReviewListItemDto[]
        pagination?: { nextCursor: string | null; hasNext: boolean }
        data?: { items?: ReviewListItemDto[] }
      }
      const nextItems = anyRes.items ?? anyRes.data?.items ?? []
      setAdditionalReviews((prev) => [...prev, ...nextItems])
      setReviewsNextCursor(anyRes.pagination?.nextCursor ?? null)
      setHasMoreReviews(Boolean(anyRes.pagination?.hasNext))
    } catch {
      setHasMoreReviews(false)
    } finally {
      setIsLoadingMoreReviews(false)
    }
  }, [restaurantId, isReviewsLoading, isLoadingMoreReviews, hasMoreReviews, reviewsNextCursor])

  const lastReviewElementRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (reviewObserverRef.current) reviewObserverRef.current.disconnect()
      if (isReviewsLoading || isLoadingMoreReviews || !hasMoreReviews) return
      reviewObserverRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          void loadMoreReviews()
        }
      })
      if (node) {
        reviewObserverRef.current.observe(node)
      }
    },
    [isReviewsLoading, isLoadingMoreReviews, hasMoreReviews, loadMoreReviews],
  )

  React.useEffect(() => {
    return () => {
      if (reviewObserverRef.current) {
        reviewObserverRef.current.disconnect()
      }
    }
  }, [])

  const baseRestaurant = {
    id: restaurantId || '',
    name: '',
    foodCategories: [] as string[],
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

    const aiSentiment = restaurantData.aiDetails?.sentiment?.positivePercent
    const positiveRatio = restaurantData.recommendStat?.positiveRatio ?? aiSentiment
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
      : typeof restaurantData.recommendedCount === 'number'
        ? restaurantData.recommendedCount
        : baseRestaurant.reviewCount

    const imagesFromApi =
      restaurantData.images && restaurantData.images.length > 0
        ? restaurantData.images.map((img) => img.url)
        : restaurantData.image?.url
          ? [restaurantData.image.url]
          : null
    const images = imagesFromApi ?? baseRestaurant.images

    const aiSummaryFromDetails = restaurantData.aiDetails?.summary?.overallSummary
    const aiSummary = aiSummaryFromDetails ?? restaurantData.aiSummary ?? baseRestaurant.aiSummary

    return {
      ...baseRestaurant,
      id: String(restaurantData.id),
      name: restaurantData.name,
      foodCategories: Array.isArray(restaurantData.foodCategories)
        ? restaurantData.foodCategories
            .map((category) => (typeof category === 'string' ? category.trim() : ''))
            .filter((category) => category.length > 0)
        : baseRestaurant.foodCategories,
      address: restaurantData.address,
      phone: restaurantData.phoneNumber ?? baseRestaurant.phone,
      images,
      reviewCount: reviewCountFromStat,
      aiSummary,
      feature: restaurantData.aiFeatures ?? baseRestaurant.feature,
      sentiment,
      businessHoursWeek:
        (restaurantData.businessHoursWeek as BusinessHoursWeekItem[] | undefined) ?? null,
    }
  })()
  const categoryText =
    restaurant.foodCategories.length > 0 ? restaurant.foodCategories.join(' · ') : '카테고리 없음'

  const aiCategoryDetails = restaurantData?.aiDetails?.summary?.categoryDetails
  const hasCategoryDetails = aiCategoryDetails && Object.keys(aiCategoryDetails).length > 0
  const aiComparisonDetails = restaurantData?.aiDetails?.comparison?.categoryDetails
  const hasComparisonDetails = aiComparisonDetails && Object.keys(aiComparisonDetails).length > 0
  const ad = restaurantData?.aiDetails
  const hasSentimentFromAi = ad?.sentiment != null
  const hasSummaryContent =
    hasCategoryDetails ||
    (ad?.summary?.overallSummary != null && String(ad.summary.overallSummary).trim() !== '')
  const hasAllAiFields = hasSentimentFromAi && hasSummaryContent && hasComparisonDetails
  const isEmptyAiDetails = !ad || !hasAllAiFields
  const hasMultipleRestaurantImages = restaurant.images.length > 1

  const summaryEvidenceOrder = React.useMemo(() => {
    const categoryOrder = ['TASTE', 'PRICE', 'SERVICE'] as const
    const list: { number: number; evidence: AiEvidenceDto; categoryKey: string }[] = []
    const byCategory: Record<string, number[]> = { TASTE: [], PRICE: [], SERVICE: [] }
    if (!aiCategoryDetails) return { ordered: list, numbersByCategory: byCategory }
    categoryOrder.forEach((key) => {
      const detail = aiCategoryDetails[key] as AiCategorySummaryDto | undefined
      if (!detail?.evidences) return
      detail.evidences.forEach((ev) => {
        const num = list.length + 1
        list.push({ number: num, evidence: ev, categoryKey: key })
        byCategory[key].push(num)
      })
    })
    return { ordered: list, numbersByCategory: byCategory }
  }, [aiCategoryDetails])

  const formatEvidenceDate = (createdAt: string | null | undefined) => {
    if (!createdAt) return ''
    try {
      const d = new Date(createdAt)
      if (Number.isNaN(d.getTime())) return ''
      const yy = d.getFullYear().toString().slice(-2)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yy}.${mm}.${dd}`
    } catch {
      return ''
    }
  }

  const scrollToEvidenceCard = (number: number) => {
    const container = evidenceScrollRef.current
    const el = container?.querySelector(`[data-card-number="${number}"]`) as HTMLElement | null
    if (!container || !el) return
    const pad = 16
    const cr = container.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    const scrollBy = er.left - cr.left - pad
    const targetLeft = Math.max(
      0,
      Math.min(container.scrollWidth - container.clientWidth, container.scrollLeft + scrollBy),
    )
    container.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    })
  }

  const isRestaurantFavorited =
    favoriteStatus?.personal ||
    (favoriteStatus?.subgroups && favoriteStatus.subgroups.some((sg) => sg.isFavorited))

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

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (summaries.length === 0) {
      setShowGroupJoinModal(true)
      return
    }

    if (Number.isFinite(parsedRestaurantId)) {
      track({
        eventName: 'ui.review.write_started',
        properties: {
          restaurantId: parsedRestaurantId,
          fromPageKey: currentPageKey,
        },
      })
    }
    navigate(`/restaurants/${restaurantId}/review`)
  }

  const handleLoginRequiredReview = () => {
    const returnTo = restaurantId ? `/restaurants/${restaurantId}/review` : '/login'
    sessionStorage.setItem('auth:return_to', returnTo)
    navigate('/login', { state: { returnTo } })
  }

  const handleFavoriteSheetOpen = () => {
    if (Number.isFinite(parsedRestaurantId)) {
      track({
        eventName: 'ui.favorite.sheet_opened',
        properties: {
          restaurantId: parsedRestaurantId,
          fromPageKey: currentPageKey,
        },
      })
    }
    setShowFavoriteSheet(true)
  }

  const handleFavoriteComplete = () => {
    void qc.invalidateQueries({ queryKey: favoriteKeys.restaurantTargets(parsedRestaurantId) })
    void qc.invalidateQueries({ queryKey: favoriteKeys.myList() })
    void qc.invalidateQueries({ queryKey: favoriteKeys.targets() })
    if (Number.isFinite(parsedRestaurantId) && favoriteStatus) {
      const selectedTargetCount =
        (favoriteStatus.personal ? 1 : 0) +
        favoriteStatus.subgroups.filter((subgroup) => subgroup.isFavorited).length
      track({
        eventName: 'ui.favorite.updated',
        properties: {
          restaurantId: parsedRestaurantId,
          selectedTargetCount,
          fromPageKey: currentPageKey,
        },
      })
    }
    toast.success('찜 목록이 업데이트되었습니다')
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
          hasMultipleRestaurantImages ? (
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {restaurant.images.map((image, idx) => (
                  <CarouselItem key={idx}>
                    <div className="aspect-[4/3] bg-muted relative">
                      <img
                        src={image}
                        alt={`${restaurant.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        fetchPriority={idx === 0 ? 'high' : 'auto'}
                        decoding="async"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="aspect-[4/3] bg-muted relative">
              <img
                src={restaurant.images[0]}
                alt={`${restaurant.name} 1`}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          )
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
                  <div className="mb-1 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <div className="min-w-0 flex flex-col">
                      <p className="text-sm text-muted-foreground">{categoryText}</p>
                      <h1 className="truncate text-2xl font-bold" title={restaurant.name || ''}>
                        {restaurant.name || '음식점 정보 없음'}
                      </h1>
                    </div>
                    <button
                      onClick={handleFavoriteSheetOpen}
                      aria-pressed={Boolean(isRestaurantFavorited)}
                      className={cn(
                        'w-10 h-10 shrink-0 flex items-center justify-center rounded-full border shadow-sm transition-colors',
                        isRestaurantFavorited
                          ? 'border-primary/20 bg-primary/10 text-primary hover:bg-primary/15'
                          : 'border-border/70 bg-background text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary',
                      )}
                      aria-label="찜하기"
                    >
                      <Heart
                        className={cn(
                          'w-5 h-5 transition-colors',
                          isRestaurantFavorited ? 'text-primary fill-primary' : 'text-current',
                        )}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Details Tabs */}
      <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
        <Container>
          <TabsList className="w-full grid grid-cols-3 rounded-2xl bg-muted/40 p-1.5 h-12 transition-colors items-center">
            <TabsTrigger
              value="info"
              className="h-full flex items-center justify-center text-base leading-none rounded-xl transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground hover:bg-muted/60 hover:text-foreground"
            >
              정보
            </TabsTrigger>
            <TabsTrigger
              value="menus"
              className="h-full flex items-center justify-center text-base leading-none rounded-xl transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground hover:bg-muted/60 hover:text-foreground"
            >
              메뉴
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="h-full flex items-center justify-center text-base leading-none rounded-xl transition-all duration-200 ease-out data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground hover:bg-muted/60 hover:text-foreground"
            >
              리뷰
            </TabsTrigger>
          </TabsList>
        </Container>

        <TabsContent value="info" className="mt-4">
          <Container className="space-y-4">
            {/* Business Hours */}
            <Card className="p-5 space-y-4">
              <h3 className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <Clock className="h-6 w-6 shrink-0" />
                영업 시간
              </h3>
              <div className="space-y-3 text-base">
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
            <Card className="divide-y overflow-hidden pt-2 pb-2 px-4">
              {isRestaurantLoading ? (
                <div className="space-y-3">
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
                    className="pt-5 pb-2 px-2"
                  />
                  <RestaurantMetaRow
                    icon={Phone}
                    label="전화번호"
                    value={restaurant.phone || '정보 없음'}
                    className="pt-5 pb-5 px-2"
                  />
                </>
              )}
            </Card>
            <p className="text-sm text-muted-foreground text-center pt-2 pb-2">
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
                    categories={menuCategories.map((c, idx) => ({ id: idx, name: c.name }))}
                    value={selectedCategoryIndex ?? 0}
                    onChange={(index: number | null) => {
                      if (index == null) return
                      setSelectedCategoryIndex(index)
                      const targetEl = menuCategoryRefsMap.current[index]
                      if (targetEl) {
                        targetEl.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }
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
                {menuCategories.map((category, categoryIndex) => (
                  <div
                    key={`category-${categoryIndex}`}
                    data-category-index={categoryIndex}
                    ref={(el) => {
                      menuCategoryRefsMap.current[categoryIndex] = el
                    }}
                  >
                    <Card className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{category.name}</h3>
                      </div>
                      {category.menus.length > 0 ? (
                        <div className="space-y-0">
                          <div className="divide-y divide-border">
                            {(expandedMenuCategoryIndices.has(categoryIndex) ||
                            category.menus.length <= MENU_ITEM_FOLD_LIMIT
                              ? category.menus
                              : category.menus.slice(0, MENU_ITEM_FOLD_LIMIT)
                            ).map((menu, menuIndex) => (
                              <div
                                key={`${categoryIndex}-${menu.id}-${menuIndex}`}
                                className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                              >
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <p className="text-lg font-medium">{menu.name}</p>
                                    {menu.isRecommended && (
                                      <span className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                                        추천
                                      </span>
                                    )}
                                  </div>
                                  {menu.description && (
                                    <p className="text-base text-muted-foreground line-clamp-2">
                                      {menu.description}
                                    </p>
                                  )}
                                  <p className="text-lg font-semibold">{formatPrice(menu.price)}</p>
                                </div>
                                {menu.imageUrl ? (
                                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                                    <img
                                      src={menu.imageUrl}
                                      alt={menu.name}
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                          {category.menus.length > MENU_ITEM_FOLD_LIMIT &&
                            !expandedMenuCategoryIndices.has(categoryIndex) && (
                              <div className="pt-3">
                                <button
                                  type="button"
                                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border"
                                  onClick={() =>
                                    setExpandedMenuCategoryIndices((prev) =>
                                      new Set(prev).add(categoryIndex),
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
              </>
            ) : (
              <Card className="p-4 text-sm text-muted-foreground">등록된 메뉴가 없습니다.</Card>
            )}
            <p className="text-sm text-muted-foreground text-center pt-4 pb-2">
              실제 메뉴와 가격은 매장 상황에 따라 다를 수 있습니다.
            </p>
          </Container>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Container className="space-y-4">
            {/* AI 분석 섹션 상단: 총 N개 리뷰 + 리뷰 작성 */}
            <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
              {isRestaurantLoading ? (
                <>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-9 w-20" />
                </>
              ) : (
                <>
                  <p className="text-lg font-bold">총 {restaurant.reviewCount}개 리뷰</p>
                  <Button onClick={handleWriteReview}>리뷰 작성</Button>
                </>
              )}
            </div>

            {/* AI 리뷰 분석 */}
            <Card className="mt-6 p-5 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-base font-bold text-primary">AI 리뷰 분석</span>
                </div>
                {isRestaurantLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : restaurant.reviewCount === 0 || isEmptyAiDetails ? (
                  <div className="py-10">
                    <p className="text-sm font-medium text-center text-muted-foreground px-4">
                      {restaurant.reviewCount === 0
                        ? '아직 리뷰가 없어요. 첫 리뷰를 작성해 보세요!'
                        : '아직 리뷰 분석 결과가 없어요.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* 비교 분석 (제목 없음) */}
                    <div className="rounded-lg border border-primary/20 border-l-4 border-l-primary bg-primary/5 p-4">
                      <div className="space-y-3">
                        {(() => {
                          const comparisonConfig: Array<{
                            key: string
                            icon: React.ComponentType<{ className?: string }>
                          }> = [
                            { key: 'PRICE', icon: DollarSign },
                            { key: 'SERVICE', icon: Heart },
                          ]
                          return comparisonConfig.map(({ key, icon: Icon }) => {
                            const comp = aiComparisonDetails?.[key] as
                              | AiCategoryComparisonDto
                              | undefined
                            const summary = comp?.summary?.trim()

                            return (
                              <div key={key} className="flex items-start gap-3">
                                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                  <Icon className="h-3.5 w-3.5" />
                                </span>
                                {summary ? (
                                  <p
                                    className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-w-0 break-words"
                                    style={{
                                      display: '-webkit-box',
                                      WebkitBoxOrient: 'vertical',
                                      WebkitLineClamp: 2,
                                    }}
                                  >
                                    {summary}
                                  </p>
                                ) : (
                                  <div className="flex-1 space-y-1.5 pt-1">
                                    <Skeleton className="h-3 w-full bg-muted/70" />
                                    <Skeleton className="h-3 w-4/5 bg-muted/60" />
                                  </div>
                                )}
                              </div>
                            )
                          })
                        })()}
                      </div>
                    </div>

                    {/* 긍정 바 + 카테고리별 요약(번호 뱃지) + 가로 스크롤 리뷰 카드 */}
                    <div className="p-4">
                      <div className="space-y-2 mb-4">
                        {isRestaurantLoading ? (
                          <>
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full rounded-full" />
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center text-sm font-medium">
                              <span className="flex items-center gap-1 text-primary">
                                <ThumbsUp className="h-3.5 w-3.5" /> 긍정적 리뷰
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                부정적 리뷰 <ThumbsDown className="h-3.5 w-3.5" />
                              </span>
                            </div>
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-sm font-medium text-primary flex-shrink-0">
                                {restaurant.sentiment.positive}%
                              </span>
                              <div className="flex h-4 flex-1 min-w-0 rounded-full overflow-hidden bg-muted">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${restaurant.sentiment.positive}%` }}
                                />
                                <div
                                  className="h-full bg-muted-foreground/30"
                                  style={{ width: `${restaurant.sentiment.negative}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-muted-foreground flex-shrink-0">
                                {restaurant.sentiment.negative}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      {hasCategoryDetails ? (
                        <>
                          <p className="text-sm font-medium text-muted-foreground mb-2 mt-5">
                            리뷰 요약
                          </p>
                          <ul className="space-y-2">
                            {(['TASTE', 'PRICE', 'SERVICE'] as const).map((key) => {
                              const detail = aiCategoryDetails?.[key] as
                                | AiCategorySummaryDto
                                | undefined
                              if (!detail) return null
                              const numbers = summaryEvidenceOrder.numbersByCategory[key] ?? []
                              return (
                                <li
                                  key={key}
                                  className="flex flex-wrap items-center gap-x-2 gap-y-1"
                                >
                                  <span className="text-muted-foreground">•</span>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {detail.summary || '아직 리뷰 분석 결과가 없어요.'}
                                  </p>
                                  {numbers.length > 0 && (
                                    <span className="flex items-center gap-1 flex-shrink-0">
                                      {numbers.map((n) => (
                                        <button
                                          key={n}
                                          type="button"
                                          onClick={() => scrollToEvidenceCard(n)}
                                          className="inline-flex w-4 h-4 rounded-full bg-muted text-muted-foreground text-[9px] font-medium items-center justify-center hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-muted-foreground focus:ring-offset-1"
                                        >
                                          {n}
                                        </button>
                                      ))}
                                    </span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                          {summaryEvidenceOrder.ordered.length > 0 && (
                            <div className="mt-6 overflow-hidden py-1 -mx-4">
                              <div
                                ref={evidenceScrollRef}
                                className="overflow-x-auto overflow-y-hidden py-1 px-4 flex gap-3 scroll-smooth"
                              >
                                {summaryEvidenceOrder.ordered.map(({ number, evidence }) => (
                                  <div
                                    key={`${evidence.reviewId}-${number}`}
                                    data-card-number={number}
                                    className="flex flex-col flex-shrink-0 w-44 p-3 rounded-lg border border-border bg-background text-left"
                                  >
                                    <div className="flex items-start justify-between mb-2 gap-2 flex-shrink-0">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-muted text-muted-foreground text-[9px] font-medium flex items-center justify-center">
                                          {number}
                                        </span>
                                        {evidence.authorName && (
                                          <span className="text-[11px] font-medium truncate">
                                            {evidence.authorName}
                                          </span>
                                        )}
                                      </div>
                                      {evidence.createdAt && (
                                        <span className="text-[10px] text-muted-foreground/70 flex-shrink-0">
                                          {formatEvidenceDate(evidence.createdAt)}
                                        </span>
                                      )}
                                    </div>
                                    <p
                                      className="text-[11px] text-muted-foreground leading-snug break-words min-w-0 overflow-hidden text-ellipsis max-h-[1.75rem]"
                                      style={{
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                      }}
                                    >
                                      {evidence.snippet}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {restaurant.aiSummary || '아직 리뷰 분석 결과가 없어요.'}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Review List */}
            <div className="space-y-4">
              {isReviewsLoading ? (
                <>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div
                    key={review.id}
                    ref={index === reviews.length - 1 ? lastReviewElementRef : undefined}
                  >
                    <DetailReviewCard variant="restaurant" review={review} />
                  </div>
                ))
              ) : (
                <Card className="p-4 text-sm text-muted-foreground">등록된 리뷰가 없습니다.</Card>
              )}
              {isLoadingMoreReviews && (
                <>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </>
              )}
            </div>
          </Container>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <ConfirmAlertDialogContent
          title="로그인이 필요합니다"
          description="리뷰를 작성하려면 로그인이 필요합니다."
          confirmText="로그인하기"
          onConfirm={handleLoginRequiredReview}
        />
      </AlertDialog>

      <AlertDialog open={showGroupJoinModal} onOpenChange={setShowGroupJoinModal}>
        <ConfirmAlertDialogContent
          title="그룹 가입이 필요합니다"
          description="리뷰를 작성하려면 그룹에 가입해야 합니다."
          confirmText="확인"
          onConfirm={() => {
            setShowGroupJoinModal(false)
            navigate(ROUTES.groups)
          }}
        />
      </AlertDialog>

      {/* 찜 선택 시트 */}
      {restaurantId && restaurantData && (
        <FavoriteSelectionSheet
          open={showFavoriteSheet}
          onOpenChange={setShowFavoriteSheet}
          restaurantId={Number(restaurantId)}
          onComplete={handleFavoriteComplete}
        />
      )}
    </div>
  )
}
