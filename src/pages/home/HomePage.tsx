import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Flame, MapPin, Sparkles } from 'lucide-react'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { SplashPopup } from '@/widgets/splash-popup'
import { HomeAdCarousel } from '@/widgets/home-ad-carousel'
import { Container } from '@/shared/ui/container'
import { LocationHeader } from '@/widgets/location-header'
import { Input } from '@/shared/ui/input'
import { Skeleton } from '@/shared/ui/skeleton'
import { DEFAULT_APP_LOCATION } from '@/shared/config/env'
import { ROUTES } from '@/shared/config/routes'
import { getHomePage } from '@/entities/main'
import type { BannerDto } from '@/entities/banner'
import { useAppLocation } from '@/entities/location'
import { getGeolocationPermissionState } from '@/shared/lib/geolocation'
import type { HomePageResponseDto } from '@/entities/main'
import { toHomePageData } from '@/entities/main'
import { getMainPageCache } from '@/app/bootstrap/mainPageCache'
import { AutoSlidingRestaurantCarousel } from './ui/AutoSlidingRestaurantCarousel'
import { HomeCategoryRestaurantSection } from './ui/HomeCategoryRestaurantSection'

const SPLASH_POPUP_DISMISSED_DATE_KEY = 'splash-popup-dismissed-date'
let dismissedSplashEventIdInSession: number | null = null

const isSplashDismissedToday = () => {
  const dismissedDate = localStorage.getItem(SPLASH_POPUP_DISMISSED_DATE_KEY)
  const today = new Date().toDateString()
  return dismissedDate === today
}

const shouldShowSplashPopup = (eventId?: number) => {
  if (!eventId) return false
  if (isSplashDismissedToday()) return false
  return dismissedSplashEventIdInSession !== eventId
}

type HomePageProps = {
  onSearchClick?: () => void
  onRestaurantClick?: (id: string, metadata?: { position: number; section: string }) => void
  onGroupClick?: (id: string) => void
  onEventClick?: (eventId: number) => void
  onSplashSettled?: () => void
}

export function HomePage({
  onSearchClick,
  onRestaurantClick,
  onEventClick,
  onSplashSettled,
}: HomePageProps) {
  const navigate = useNavigate()
  const [homeData, setHomeData] = useState<HomePageResponseDto | null>(null)
  const [isMainLoading, setIsMainLoading] = useState(true)
  const [hasLoadedMain, setHasLoadedMain] = useState(false)
  const [showSplashPopup, setShowSplashPopup] = useState(false)
  const { location, status, requestCurrentLocation } = useAppLocation()
  const hasRefreshedRef = useRef(false)
  const latitude = location?.latitude ?? DEFAULT_APP_LOCATION.latitude
  const longitude = location?.longitude ?? DEFAULT_APP_LOCATION.longitude

  useEffect(() => {
    const cached = getMainPageCache(latitude, longitude)
    if (cached) {
      queueMicrotask(() => {
        setHomeData(cached)
        const splashPromotion = cached.data?.splashPromotion
        const willShow = shouldShowSplashPopup(splashPromotion?.id)
        setShowSplashPopup(willShow)
        if (!willShow) onSplashSettled?.()
        setIsMainLoading(false)
        setHasLoadedMain(true)
      })
      return
    }

    queueMicrotask(() => setIsMainLoading(true))
    getHomePage({ latitude, longitude })
      .then((data) => {
        setHomeData(data)
        const splashPromotion = data.data?.splashPromotion
        const willShow = shouldShowSplashPopup(splashPromotion?.id)
        setShowSplashPopup(willShow)
        if (!willShow) onSplashSettled?.()
      })
      .catch(() => {
        onSplashSettled?.()
      })
      .finally(() => {
        setIsMainLoading(false)
        setHasLoadedMain(true)
      })
  }, [latitude, longitude, onSplashSettled])

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

  const mainPageData = toHomePageData(homeData)
  const banners: BannerDto[] =
    homeData?.data?.banners?.items?.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      title: null,
      deeplinkUrl: item.landingUrl,
      bgColor: null,
      displayOrder: item.order,
    })) ?? []
  const splashEvent = homeData?.data?.splashPromotion

  const closeSplashPopup = (dontShowToday: boolean) => {
    if (splashEvent?.id) {
      dismissedSplashEventIdInSession = splashEvent.id
    }
    if (dontShowToday) {
      localStorage.setItem(SPLASH_POPUP_DISMISSED_DATE_KEY, new Date().toDateString())
    }
    setShowSplashPopup(false)
    onSplashSettled?.()
  }

  const heroSection = mainPageData.heroSection
  const distanceSection = mainPageData.distanceSection
  const isInitialMainLoading = isMainLoading && !hasLoadedMain
  const shouldRenderBannerSection = isInitialMainLoading || banners.length > 0

  const renderBannerSkeleton = () => (
    <div aria-hidden="true" className="w-full">
      <div className="relative h-24 overflow-hidden rounded-lg sm:h-28">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    </div>
  )

  return (
    <div className="pb-20 overflow-x-hidden">
      {splashEvent && (
        <SplashPopup
          event={splashEvent}
          isOpen={showSplashPopup}
          onClose={({ dontShowToday }) => closeSplashPopup(dontShowToday)}
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
        <Container className="mb-4">
          <div className="flex items-center gap-2">
            {heroSection?.type === 'HOT' ? (
              <Flame className="h-5 w-5 text-primary" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary" />
            )}
            <h2 className="text-lg font-semibold">{heroSection?.title ?? '당신을 위한 추천'}</h2>
          </div>
        </Container>
        {isMainLoading && !heroSection ? (
          <div className="px-4">
            <div className="overflow-hidden rounded-lg border bg-card">
              <Skeleton className="aspect-[21/10] w-full rounded-none" />
              <div className="space-y-2 px-4 pb-4 pt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        ) : heroSection ? (
          <AutoSlidingRestaurantCarousel
            items={heroSection.items}
            section={heroSection.type === 'HOT' ? 'HOT_FALLBACK' : 'RECOMMEND'}
            onRestaurantClick={onRestaurantClick}
          />
        ) : (
          <div className="px-4 py-6 min-h-[12rem] flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">데이터가 없습니다</p>
          </div>
        )}
      </section>

      <section className="mb-8">
        <Container className="mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{distanceSection?.title ?? '가까운 음식점'}</h2>
          </div>
        </Container>
        <HomeCategoryRestaurantSection
          groups={distanceSection?.groups ?? []}
          isLoading={isMainLoading && !distanceSection}
          sectionType="DISTANCE"
          onRestaurantClick={onRestaurantClick}
        />
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
