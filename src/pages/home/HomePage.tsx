import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { MainRestaurantCard } from '@/entities/restaurant/ui'
import { ROUTES } from '@/shared/config/routes'
import { getMainPage } from '@/entities/main/api/mainApi'
import type { MainResponse } from '@/entities/main/model/types'

type HomePageProps = {
  onSearchClick?: () => void
  onRestaurantClick?: (id: string) => void
  onGroupClick?: (id: string) => void
}

export function HomePage({ onSearchClick, onRestaurantClick }: HomePageProps) {
  const navigate = useNavigate()
  const [mainData, setMainData] = useState<MainResponse | null>(null)

  useEffect(() => {
    getMainPage({ latitude: 37.5, longitude: 127.0 })
      .then(setMainData)
      .catch(() => {})
  }, [])

  return (
    <div className="pb-20">
      <TopAppBar title="Tasteam" />

      {/* 검색바 숨김
      <Container className="pt-4 pb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="음식점, 지역, 음식 종류 검색"
            className="pl-9 bg-secondary"
            readOnly
          />
        </div>
      </Container>
      */}

      {mainData?.data?.sections && mainData.data.sections.length > 0 ? (
        mainData.data.sections.map(
          (section) =>
            section.items?.length > 0 && (
              <section key={section.type} className="space-y-4 mb-8">
                <Container>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </Container>
                <Container className="overflow-x-auto pb-2 scrollbar-hide">
                  <div className="flex w-max gap-3">
                    {section.items.map((item) => (
                      <div key={item.restaurantId} className="w-[280px] shrink-0">
                        <MainRestaurantCard item={item} onClick={onRestaurantClick} />
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            ),
        )
      ) : (
        <Container className="py-16 text-center text-sm text-muted-foreground">
          추천 맛집이 없습니다.
        </Container>
      )}

      {/* 내 그룹 숨김
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
      */}

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
