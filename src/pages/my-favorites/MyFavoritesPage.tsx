import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/widgets/empty-state'
import { RestaurantCard } from '@/entities/restaurant'
import { getMyFavoriteRestaurants, deleteMyFavoriteRestaurant } from '@/entities/favorite'
import { favoriteKeys } from '@/entities/favorite/model/favoriteKeys'
import { STALE_USER } from '@/shared/lib/queryConstants'

type MyFavoritesPageProps = {
  onRestaurantClick?: (id: string) => void
  onBack?: () => void
}

export function MyFavoritesPage({ onRestaurantClick, onBack }: MyFavoritesPageProps) {
  const qc = useQueryClient()

  const { data: favData } = useQuery({
    queryKey: favoriteKeys.myList(),
    queryFn: () => getMyFavoriteRestaurants(),
    staleTime: STALE_USER,
  })

  const favorites = (() => {
    if (!favData) return []
    const items = (favData as any).data?.items ?? (favData as any).items ?? []
    return items.map((item: any) => ({
      id: String(item.restaurantId),
      name: item.name,
      foodCategories: Array.isArray(item.foodCategories)
        ? item.foodCategories
            .map((category: any) => (typeof category === 'string' ? category.trim() : ''))
            .filter((category: string) => category.length > 0)
        : [],
      category: item.category,
      rating: 4.5,
      reviewCount: 0,
      address: '',
      imageUrl: item.thumbnailUrl,
    }))
  })()

  const deleteMutation = useMutation({
    mutationFn: (restaurantId: number) => deleteMyFavoriteRestaurant(restaurantId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: favoriteKeys.myList() })
      toast.success('찜 목록에서 삭제되었습니다')
    },
  })

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="찜한 맛집" showBackButton onBack={onBack} />

      <Container className="flex-1 py-4 overflow-auto">
        {favorites.length > 0 ? (
          <div className="space-y-3">
            {favorites.map((restaurant: any) => (
              <RestaurantCard
                key={restaurant.id}
                name={restaurant.name}
                foodCategories={restaurant.foodCategories}
                category={restaurant.category}
                rating={restaurant.rating}
                reviewCount={restaurant.reviewCount}
                address={restaurant.address}
                imageUrl={restaurant.imageUrl}
                isSaved={true}
                onSave={() => deleteMutation.mutate(Number(restaurant.id))}
                onClick={() => onRestaurantClick?.(restaurant.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="찜한 맛집이 없어요"
            description="마음에 드는 맛집을 찜해보세요"
          />
        )}
      </Container>
    </div>
  )
}
