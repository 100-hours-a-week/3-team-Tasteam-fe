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
import { ROUTES } from '@/shared/config/routes'
import { getMainPage } from '@/entities/main'
import { getBanners } from '@/entities/banner'
import type { BannerDto } from '@/entities/banner'
import { useAppLocation } from '@/entities/location'
import { getGeolocationPermissionState } from '@/shared/lib/geolocation'
import type { MainPageResponseDto, MainSectionDto, MainSectionItemDto } from '@/entities/main'
import { toMainPageData } from '@/entities/main'

type HomePageProps = {
  onSearchClick?: () => void
  onRestaurantClick?: (id: string) => void
  onGroupClick?: (id: string) => void
}

export function HomePage({ onSearchClick, onRestaurantClick }: HomePageProps) {
  const navigate = useNavigate()
  const [mainData, setMainData] = useState<MainPageResponseDto | null>(null)
  const [banners, setBanners] = useState<BannerDto[]>([])
  const [isMainLoading, setIsMainLoading] = useState(true)
  const [hasLoadedMain, setHasLoadedMain] = useState(false)
  const [showSplashPopup, setShowSplashPopup] = useState(false)
  const { location, status, requestCurrentLocation } = useAppLocation()
  const hasRefreshedRef = useRef(false)
  const latitude = location?.latitude ?? 37.5665
  const longitude = location?.longitude ?? 126.978

  useEffect(() => {
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
    let cancelled = false
    getBanners()
      .then((response) => {
        if (cancelled) return
        setBanners(response.data?.banners ?? [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

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
  const sections = mainPageData.sections
  const resolvedSections = sections

  const newSection = resolvedSections.find((section) => section.type === 'NEW')
  const hotSection = resolvedSections.find((section) => section.type === 'HOT')

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
              <div key={i} className="w-[260px] shrink-0">
                <div className="h-48 bg-background rounded-lg" />
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
          {items.map((item: MainSectionItemDto) => (
            <div key={item.restaurantId} className="w-[260px] shrink-0">
              <HorizontalRestaurantCard
                id={item.restaurantId}
                name={item.name}
                category={item.category}
                distance={item.distanceMeter}
                image={item.thumbnailImageUrl}
                tags={[]}
                onClick={onRestaurantClick}
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
              <div key={i} className="h-52 bg-background rounded-lg" />
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
          {items.map((item: MainSectionItemDto) => (
            <VerticalRestaurantCard
              key={item.restaurantId}
              id={item.restaurantId}
              name={item.name}
              category={item.category}
              distance={item.distanceMeter}
              image={item.thumbnailImageUrl}
              tags={[]}
              reason={item.reviewSummary}
              onClick={onRestaurantClick}
            />
          ))}
        </div>
      </Container>
    )
  }

  return (
    <div className="pb-20">
      {mainData?.data?.splashEvent && (
        <SplashPopup
          event={mainData.data.splashEvent}
          isOpen={showSplashPopup}
          onClose={() => setShowSplashPopup(false)}
          onLinkClick={() => navigate(ROUTES.events)}
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

      {banners.length > 0 && (
        <section className="mb-6">
          <Container>
            <HomeAdCarousel
              banners={banners}
              onBannerClick={(banner) => {
                if (banner.deeplinkUrl) {
                  navigate(banner.deeplinkUrl)
                }
              }}
            />
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
