import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/widgets/empty-state'
import { Skeleton } from '@/shared/ui/skeleton'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { ROUTES } from '@/shared/config/routes'
import { useAuth } from '@/entities/user'
import { FavoriteCategoryFilter } from './components/FavoriteCategoryFilter'
import { FavoriteRestaurantCard } from './components/FavoriteRestaurantCard'
import { SubgroupSelectorSheet } from './components/SubgroupSelectorSheet'
import {
  getFavoriteTargets,
  getMyFavoriteRestaurants,
  getSubgroupFavoriteRestaurants,
  deleteMyFavoriteRestaurant,
  deleteSubgroupFavoriteRestaurant,
} from '@/entities/favorite'
import type { FavoriteTarget, FavoriteTab, FavoriteRestaurantItem } from '@/entities/favorite'

type FavoritesPageProps = {
  onRestaurantClick?: (id: string) => void
}

export function FavoritesPage({ onRestaurantClick }: FavoritesPageProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [selectedTab, setSelectedTab] = useState<FavoriteTab>('personal')
  const [selectedSubgroupId, setSelectedSubgroupId] = useState<number | null>(null)
  const [showSubgroupSelector, setShowSubgroupSelector] = useState(false)

  // 데이터 상태
  const [favoriteTargets, setFavoriteTargets] = useState<FavoriteTarget[]>([])
  const [personalFavorites, setPersonalFavorites] = useState<FavoriteRestaurantItem[]>([])
  const [subgroupFavorites, setSubgroupFavorites] = useState<FavoriteRestaurantItem[]>([])

  // UI 상태
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 페이지네이션 (향후 무한 스크롤 구현 시 사용)
  const [, setPersonalCursor] = useState<string | null>(null)
  const [, setSubgroupCursor] = useState<string | null>(null)
  const [, setHasMorePersonal] = useState(false)
  const [, setHasMoreSubgroup] = useState(false)

  // 찜 타겟 목록 조회
  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteTargets([])
      setPersonalFavorites([])
      setSubgroupFavorites([])
      setSelectedSubgroupId(null)
      setIsLoading(false)
      setIsLoadingFavorites(false)
      setError(null)
      return
    }

    const loadTargets = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await getFavoriteTargets()
        const data = response.data

        const targets: FavoriteTarget[] = [
          {
            id: 'my',
            type: 'personal',
            name: '내 찜',
            favoriteCount: data.myFavorite.favoriteCount,
          },
          ...data.subgroupFavorites.map((subgroup) => ({
            id: `subgroup-${subgroup.subgroupId}`,
            type: 'group' as const,
            name: subgroup.name, // 백엔드에서 name으로 반환 (subgroupName)
            subgroupId: subgroup.subgroupId,
            favoriteCount: subgroup.favoriteCount,
          })),
        ]

        setFavoriteTargets(targets)

        // 첫 번째 하위그룹이 있으면 선택
        if (data.subgroupFavorites.length > 0 && !selectedSubgroupId) {
          setSelectedSubgroupId(data.subgroupFavorites[0].subgroupId)
        }
      } catch (err) {
        console.error('찜 타겟 목록 조회 실패:', err)
        setError('찜 목록을 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    loadTargets()
  }, [isAuthenticated, selectedSubgroupId])

  // 내 찜 목록 조회
  useEffect(() => {
    if (!isAuthenticated) return
    if (selectedTab !== 'personal') return

    const loadPersonalFavorites = async () => {
      setIsLoadingFavorites(true)
      try {
        const response = await getMyFavoriteRestaurants()
        const data = (response as any).data || response
        setPersonalFavorites(data.items || [])
        setPersonalCursor(data.pagination?.nextCursor || null)
        setHasMorePersonal(data.pagination?.hasNext || false)
      } catch (err) {
        console.error('내 찜 목록 조회 실패:', err)
        setPersonalFavorites([])
      } finally {
        setIsLoadingFavorites(false)
      }
    }

    loadPersonalFavorites()
  }, [isAuthenticated, selectedTab])

  // 하위그룹 찜 목록 조회
  useEffect(() => {
    if (!isAuthenticated) return
    if (selectedTab !== 'group' || !selectedSubgroupId) return

    const loadSubgroupFavorites = async () => {
      setIsLoadingFavorites(true)
      try {
        const response = await getSubgroupFavoriteRestaurants(selectedSubgroupId, {
          cursor: undefined,
        })
        console.log('하위그룹 찜 목록 전체 응답:', response)
        // request 함수가 response.data를 반환하므로 response는 CursorPageResponse 형태
        // 하지만 백엔드가 SuccessResponse로 래핑하면 response.data.items 형태일 수 있음
        const data = (response as any).data || response
        console.log('하위그룹 찜 목록 데이터:', data)
        console.log('하위그룹 찜 목록 items:', data.items)
        setSubgroupFavorites(data.items || [])
        setSubgroupCursor(data.pagination?.nextCursor || null)
        setHasMoreSubgroup(data.pagination?.hasNext || false)
      } catch (err) {
        console.error('하위그룹 찜 목록 조회 실패:', err)
        setSubgroupFavorites([])
      } finally {
        setIsLoadingFavorites(false)
      }
    }

    loadSubgroupFavorites()
  }, [isAuthenticated, selectedTab, selectedSubgroupId])

  // 찜 해제 핸들러
  const handleRemoveFavorite = async (restaurantId: number, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      if (selectedTab === 'personal') {
        await deleteMyFavoriteRestaurant(restaurantId)
        setPersonalFavorites((prev) => prev.filter((item) => item.restaurantId !== restaurantId))
        // 타겟 목록의 개수 업데이트
        setFavoriteTargets((prev) =>
          prev.map((target) =>
            target.id === 'my'
              ? { ...target, favoriteCount: Math.max(0, (target.favoriteCount || 0) - 1) }
              : target,
          ),
        )
      } else if (selectedSubgroupId) {
        await deleteSubgroupFavoriteRestaurant(selectedSubgroupId, restaurantId)
        setSubgroupFavorites((prev) => prev.filter((item) => item.restaurantId !== restaurantId))
        // 타겟 목록의 개수 업데이트
        setFavoriteTargets((prev) =>
          prev.map((target) =>
            target.subgroupId === selectedSubgroupId
              ? { ...target, favoriteCount: Math.max(0, (target.favoriteCount || 0) - 1) }
              : target,
          ),
        )
      }
      toast.success('찜 목록에서 삭제되었습니다')
    } catch (err) {
      console.error('찜 삭제 실패:', err)
      toast.error('찜 삭제에 실패했습니다')
    }
  }

  const selectedSubgroup = favoriteTargets.find(
    (target) => target.subgroupId === selectedSubgroupId,
  )

  const currentRestaurants = selectedTab === 'personal' ? personalFavorites : subgroupFavorites

  return (
    <div className="flex flex-col h-full bg-background min-h-screen pb-20">
      <TopAppBar title="찜" />

      {/* Category Filter */}
      {isAuthenticated && !isLoading && (
        <FavoriteCategoryFilter
          selectedTab={selectedTab}
          selectedSubgroup={selectedSubgroup || null}
          onTabChange={setSelectedTab}
          onSubgroupClick={() => setShowSubgroupSelector(true)}
        />
      )}

      {/* Content */}
      <Container className="flex-1 py-4 overflow-auto">
        {!isAuthenticated ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <EmptyState
              icon={LogIn}
              title="로그인이 필요해요"
              description="찜 목록을 보려면 로그인해주세요"
              actionLabel="로그인하기"
              onAction={() => {
                const returnTo = ROUTES.favorites
                sessionStorage.setItem('auth:return_to', returnTo)
                navigate(ROUTES.login, { state: { returnTo } })
              }}
            />
          </div>
        ) : isLoading || isLoadingFavorites ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : error ? (
          <EmptyState icon={Heart} title="오류가 발생했습니다" description={error} />
        ) : currentRestaurants.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="찜한 맛집이 없습니다"
            description="마음에 드는 맛집을 찜해보세요!"
          />
        ) : (
          <div className="space-y-3">
            {currentRestaurants.map((restaurant) => (
              <FavoriteRestaurantCard
                key={restaurant.restaurantId}
                restaurant={restaurant}
                onRemove={(e) => handleRemoveFavorite(restaurant.restaurantId, e)}
                onClick={() => onRestaurantClick?.(String(restaurant.restaurantId))}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Group Selector Sheet */}
      <SubgroupSelectorSheet
        open={showSubgroupSelector}
        onClose={() => setShowSubgroupSelector(false)}
        subgroups={favoriteTargets.filter((t) => t.type === 'group')}
        selectedSubgroupId={selectedSubgroupId}
        onSelect={(subgroupId) => {
          setSelectedSubgroupId(subgroupId)
          setSelectedTab('group')
        }}
      />

      {/* Bottom Tab Bar */}
      <BottomTabBar
        currentTab="favorites"
        onTabChange={(tab: TabId) => {
          if (tab === 'home') navigate(ROUTES.home)
          else if (tab === 'search') navigate(ROUTES.search)
          else if (tab === 'groups') navigate(ROUTES.groups)
          else if (tab === 'profile') navigate(ROUTES.profile)
        }}
      />
    </div>
  )
}
