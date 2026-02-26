import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Flame, Sparkles } from 'lucide-react'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { SplashPopup } from '@/widgets/splash-popup'
import { HomeAdCarousel } from '@/widgets/home-ad-carousel'
import { Container } from '@/shared/ui/container'
import { LocationHeader } from '@/widgets/location-header'
import { HeroRecommendationCard } from '@/widgets/hero-recommendation'
import { HorizontalRestaurantCard, VerticalRestaurantCard } from '@/widgets/restaurant-card'
import { Input } from '@/shared/ui/input'
import { Skeleton } from '@/shared/ui/skeleton'
import { ROUTES } from '@/shared/config/routes'
import { getMainPage } from '@/entities/main'
import type { BannerDto } from '@/entities/banner'
import { useAppLocation } from '@/entities/location'
import { getGeolocationPermissionState } from '@/shared/lib/geolocation'
import type { MainPageResponseDto, MainSectionDto, MainSectionItemDto } from '@/entities/main'
import { toMainPageData } from '@/entities/main'
import { getMainPageCache } from '@/app/bootstrap/mainPageCache'

type HomePageProps = {
  onSearchClick?: () => void
  onRestaurantClick?: (id: string, metadata?: { position: number; section: string }) => void
  onGroupClick?: (id: string) => void
  onEventClick?: (eventId: number) => void
}

export function HomePage({ onSearchClick, onRestaurantClick, onEventClick }: HomePageProps) {
  const navigate = useNavigate()
  const [mainData, setMainData] = useState<MainPageResponseDto | null>(null)
  const [isMainLoading, setIsMainLoading] = useState(true)
  const [hasLoadedMain, setHasLoadedMain] = useState(false)
  const [showSplashPopup, setShowSplashPopup] = useState(false)
  const { location, status, requestCurrentLocation } = useAppLocation()
  const hasRefreshedRef = useRef(false)
  const latitude = location?.latitude ?? 37.5665
  const longitude = location?.longitude ?? 126.978

  useEffect(() => {
    const cached = getMainPageCache(latitude, longitude)
    if (cached) {
      queueMicrotask(() => {
        setMainData(cached)
        const splashEvent = cached.data?.splashEvent
        if (splashEvent) {
          const dismissedDate = localStorage.getItem('splash-popup-dismissed-date')
          const today = new Date().toDateString()
          setShowSplashPopup(!dismissedDate || dismissedDate !== today)
        }
        setIsMainLoading(false)
        setHasLoadedMain(true)
      })
      return
    }

    queueMicrotask(() => setIsMainLoading(true))
    getMainPage({ latitude, longitude })
      .then((data) => {
        setMainData(data)
        const splashEvent = data.data?.splashEvent
        if (splashEvent) {
          const dismissedDate = localStorage.getItem('splash-popup-dismissed-date')
          const today = new Date().toDateString()
          const shouldShow = !dismissedDate || dismissedDate !== today
          setShowSplashPopup(shouldShow)
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsMainLoading(false)
        setHasLoadedMain(true)
      })
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

  const mainPageData = toMainPageData(mainData)
  const banners: BannerDto[] =
    mainData?.data?.banners?.items?.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      title: null,
      deeplinkUrl: item.landingUrl,
      bgColor: null,
      displayOrder: item.order,
    })) ?? []
  const sections = mainPageData.sections
  const resolvedSections = sections
  const splashEvent = mainData?.data?.splashEvent

  const newSection = resolvedSections.find((section) => section.type === 'NEW')
  const hotSection = resolvedSections.find((section) => section.type === 'HOT')
  const isInitialMainLoading = isMainLoading && !hasLoadedMain
  const shouldRenderBannerSection = isInitialMainLoading || banners.length > 0

  const renderBannerSkeleton = () => (
    <div aria-hidden="true" className="w-full">
      <div className="relative h-24 overflow-hidden rounded-lg sm:h-28">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    </div>
  )

  const renderHorizontal = (section?: MainSectionDto) => {
    const items = section?.items ?? []
    if (isMainLoading && items.length === 0) {
      if (hasLoadedMain) {
        return (
          <div className="px-4 py-6 min-h-[12rem] flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">데이터가 없습니다</p>
          </div>
        )
      }
      return (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex w-max gap-3 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[260px] shrink-0" aria-hidden="true">
                <div className="overflow-hidden rounded-lg border bg-card">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-2 px-4 pb-4 pt-3">
                    <Skeleton className="h-5 w-2/3" />
                    <div className="flex items-center justify-between gap-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (items.length === 0) {
      return (
        <div className="px-4 py-6 min-h-[12rem] flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">데이터가 없습니다</p>
        </div>
      )
    }
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max gap-3 px-4">
          {items.map((item: MainSectionItemDto, index) => (
            <div key={item.restaurantId} className="w-[260px] shrink-0">
              <HorizontalRestaurantCard
                id={item.restaurantId}
                name={item.name}
                category={item.category}
                distance={item.distanceMeter}
                image={item.thumbnailImageUrl}
                tags={[]}
                onClick={(id) =>
                  onRestaurantClick?.(id, {
                    position: index,
                    section: section?.type ?? 'UNKNOWN',
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderVertical = (section?: MainSectionDto) => {
    const items = section?.items ?? []
    if (isMainLoading && items.length === 0) {
      if (hasLoadedMain) {
        return (
          <Container>
            <div className="min-h-[13rem] flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">데이터가 없습니다</p>
            </div>
          </Container>
        )
      }
      return (
        <Container>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2" aria-hidden="true">
                <div className="rounded-md border border-primary/10 bg-primary/5 px-2.5 py-1.5">
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="overflow-hidden rounded-lg border bg-card">
                  <Skeleton className="aspect-[21/10] w-full rounded-none" />
                  <div className="space-y-2 px-4 pb-4 pt-3">
                    <Skeleton className="h-5 w-1/2" />
                    <div className="flex items-center justify-between gap-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      )
    }
    if (items.length === 0) {
      return (
        <Container>
          <div className="min-h-[13rem] flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">데이터가 없습니다</p>
          </div>
        </Container>
      )
    }
    return (
      <Container>
        <div className="space-y-4">
          {items.map((item: MainSectionItemDto, index) => (
            <VerticalRestaurantCard
              key={item.restaurantId}
              id={item.restaurantId}
              name={item.name}
              category={item.category}
              distance={item.distanceMeter}
              image={item.thumbnailImageUrl}
              tags={[]}
              reason={item.reviewSummary}
              onClick={(id) =>
                onRestaurantClick?.(id, {
                  position: index,
                  section: section?.type ?? 'UNKNOWN',
                })
              }
            />
          ))}
        </div>
      </Container>
    )
  }

  return (
    <div className="pb-20">
      {splashEvent && (
        <SplashPopup
          event={splashEvent}
          isOpen={showSplashPopup}
          onClose={() => setShowSplashPopup(false)}
          onLinkClick={() => {
            onEventClick?.(splashEvent.id)
            navigate(ROUTES.events)
          }}
        />
      )}

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

      {shouldRenderBannerSection && (
        <section className="mb-6">
          <Container>
            {banners.length > 0 ? (
              <HomeAdCarousel
                banners={banners}
                onBannerClick={(banner) => {
                  if (banner.deeplinkUrl) {
                    navigate(banner.deeplinkUrl)
                  }
                }}
              />
            ) : (
              renderBannerSkeleton()
            )}
          </Container>
        </section>
      )}

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
        {renderHorizontal(newSection)}
      </section>

      <section className="mb-8">
        <Container className="mb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">이번주 Hot</h2>
          </div>
        </Container>
        {renderVertical(hotSection)}
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
          } else if (tab === 'favorites') {
            navigate(ROUTES.favorites)
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
