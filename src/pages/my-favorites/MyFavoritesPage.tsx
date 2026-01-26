import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { EmptyState } from '@/widgets/empty-state'
import { RestaurantCard } from '@/entities/restaurant/ui'
import { getMyFavoriteRestaurants } from '@/entities/favorite/api/favoriteApi'

type FavoriteRestaurant = {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  address: string
  imageUrl?: string
}

type MyFavoritesPageProps = {
  onRestaurantClick?: (id: string) => void
  onBack?: () => void
}

const defaultFavorites: FavoriteRestaurant[] = [
  {
    id: '1',
    name: '한옥마을 순두부',
    category: '한식',
    rating: 4.5,
    reviewCount: 128,
    address: '서울시 종로구',
  },
  {
    id: '2',
    name: '우동 카덴',
    category: '일식',
    rating: 4.3,
    reviewCount: 89,
    address: '서울시 마포구',
  },
  {
    id: '3',
    name: '브런치 카페',
    category: '카페',
    rating: 4.7,
    reviewCount: 256,
    address: '서울시 강남구',
  },
]

export function MyFavoritesPage({ onRestaurantClick, onBack }: MyFavoritesPageProps) {
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([])

  useEffect(() => {
    getMyFavoriteRestaurants()
      .then((response) => {
        const apiData =
          response.items?.map((item) => ({
            id: String(item.restaurantId),
            name: item.name,
            category: '맛집',
            rating: 4.5,
            reviewCount: 0,
            address: '',
            imageUrl: item.thumbnailUrl,
          })) ?? defaultFavorites
        setFavorites(apiData)
      })
      .catch(() => setFavorites(defaultFavorites))
  }, [])

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
    toast.success('찜 목록에서 삭제되었습니다')
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="찜한 맛집" showBackButton onBack={onBack} />

      <Container className="flex-1 py-4 overflow-auto">
        {favorites.length > 0 ? (
          <div className="space-y-3">
            {favorites.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                name={restaurant.name}
                category={restaurant.category}
                rating={restaurant.rating}
                reviewCount={restaurant.reviewCount}
                address={restaurant.address}
                imageUrl={restaurant.imageUrl}
                isSaved={true}
                onSave={() => handleRemove(restaurant.id)}
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
