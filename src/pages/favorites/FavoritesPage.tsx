import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { favoriteKeys } from '@/entities/favorite/model/favoriteKeys'
import type { FavoriteTarget, FavoriteTab, FavoriteRestaurantItem } from '@/entities/favorite'
import { STALE_USER } from '@/shared/lib/queryConstants'

type FavoritesPageProps = {
  onRestaurantClick?: (id: string) => void
}

export function FavoritesPage({ onRestaurantClick }: FavoritesPageProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const qc = useQueryClient()
  const [selectedTab, setSelectedTab] = useState<FavoriteTab>('personal')
  const [selectedSubgroupId, setSelectedSubgroupId] = useState<number | null>(null)
  const [showSubgroupSelector, setShowSubgroupSelector] = useState(false)

  // 찜 타겟 목록
  const {
    data: targetsData,
    isLoading: isTargetsLoading,
    isError: isTargetsError,
  } = useQuery({
    queryKey: favoriteKeys.targets(),
    queryFn: () => getFavoriteTargets(),
    enabled: isAuthenticated,
    staleTime: STALE_USER,
  })

  // 찜 타겟 목록 파싱
  const favoriteTargets: FavoriteTarget[] = (() => {
    if (!targetsData?.data) return []
    const data = targetsData.data
    return [
      {
        id: 'my',
        type: 'personal' as const,
        name: '내 찜',
        favoriteCount: data.myFavorite.favoriteCount,
      },
      ...data.subgroupFavorites.map((subgroup) => ({
        id: `subgroup-${subgroup.subgroupId}`,
        type: 'group' as const,
        name: subgroup.name,
        subgroupId: subgroup.subgroupId,
        favoriteCount: subgroup.favoriteCount,
      })),
    ]
  })()

  // 첫 번째 하위그룹 자동 선택
  const resolvedSubgroupId =
    selectedSubgroupId ?? targetsData?.data?.subgroupFavorites?.[0]?.subgroupId ?? null

  // 내 찜 목록
  const { data: personalData, isLoading: isPersonalLoading } = useQuery({
    queryKey: favoriteKeys.myList(),
    queryFn: () => getMyFavoriteRestaurants(),
    enabled: isAuthenticated && selectedTab === 'personal',
    staleTime: STALE_USER,
  })

  const personalFavorites: FavoriteRestaurantItem[] = (() => {
    if (!personalData) return []
    const data = (personalData as any).data || personalData
    return data.items || []
  })()

  // 하위그룹 찜 목록
  const { data: subgroupData, isLoading: isSubgroupLoading } = useQuery({
    queryKey: favoriteKeys.subgroup(resolvedSubgroupId ?? 0),
    queryFn: () => getSubgroupFavoriteRestaurants(resolvedSubgroupId!, {}),
    enabled: isAuthenticated && selectedTab === 'group' && resolvedSubgroupId != null,
    staleTime: STALE_USER,
  })

  const subgroupFavorites: FavoriteRestaurantItem[] = (() => {
    if (!subgroupData) return []
    const data = (subgroupData as any).data || subgroupData
    return data.items || []
  })()

  // 내 찜 삭제 mutation
  const deletePersonalMutation = useMutation({
    mutationFn: (restaurantId: number) => deleteMyFavoriteRestaurant(restaurantId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: favoriteKeys.myList() })
      void qc.invalidateQueries({ queryKey: favoriteKeys.targets() })
      toast.success('찜 목록에서 삭제되었습니다')
    },
    onError: () => {
      toast.error('찜 삭제에 실패했습니다')
    },
  })

  // 하위그룹 찜 삭제 mutation
  const deleteSubgroupMutation = useMutation({
    mutationFn: ({ subgroupId, restaurantId }: { subgroupId: number; restaurantId: number }) =>
      deleteSubgroupFavoriteRestaurant(subgroupId, restaurantId),
    onSuccess: (_data, { subgroupId }) => {
      void qc.invalidateQueries({ queryKey: favoriteKeys.subgroup(subgroupId) })
      void qc.invalidateQueries({ queryKey: favoriteKeys.targets() })
      toast.success('찜 목록에서 삭제되었습니다')
    },
    onError: () => {
      toast.error('찜 삭제에 실패했습니다')
    },
  })

  const handleRemoveFavorite = (restaurantId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedTab === 'personal') {
      deletePersonalMutation.mutate(restaurantId)
    } else if (resolvedSubgroupId != null) {
      deleteSubgroupMutation.mutate({ subgroupId: resolvedSubgroupId, restaurantId })
    }
  }

  const isLoading = isTargetsLoading
  const isLoadingFavorites = isPersonalLoading || isSubgroupLoading
  const error = isTargetsError ? '찜 목록을 불러오는데 실패했습니다' : null

  const selectedSubgroup = favoriteTargets.find(
    (target) => target.subgroupId === (resolvedSubgroupId ?? undefined),
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
        selectedSubgroupId={resolvedSubgroupId}
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
