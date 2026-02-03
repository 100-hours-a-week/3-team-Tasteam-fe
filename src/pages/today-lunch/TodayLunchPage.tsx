import { useEffect, useState } from 'react'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Container } from '@/widgets/container'
import { VerticalRestaurantCard } from '@/widgets/restaurant-card'
import { getMainPage } from '@/entities/main/api/mainApi'
import { useAppLocation } from '@/entities/location'
import type { MainSectionItemDto } from '@/entities/main/model/types'
import { toAiRecommendData } from '@/entities/main/model/mapper'

type TodayLunchPageProps = {
  onBack?: () => void
  onRestaurantClick?: (id: string) => void
}

export function TodayLunchPage({ onBack, onRestaurantClick }: TodayLunchPageProps) {
  const [recommendations, setRecommendations] = useState<MainSectionItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { location } = useAppLocation()
  const latitude = location?.latitude ?? 37.5665
  const longitude = location?.longitude ?? 126.978

  useEffect(() => {
    let active = true

    queueMicrotask(() => {
      if (active) setIsLoading(true)
    })

    getMainPage({ latitude, longitude })
      .then((response) => {
        if (!active) return
        const aiRecommend = toAiRecommendData(response).section
        if (aiRecommend) setRecommendations(aiRecommend.items)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [latitude, longitude])

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-10 bg-background border-b">
        <Container className="py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">오늘 점심 뭐먹지?</h1>
          </div>
        </Container>
      </div>

      <Container className="py-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="text-muted-foreground">AI가 추천하는 오늘의 맛집</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-background rounded-lg" />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((item) => (
              <VerticalRestaurantCard
                key={item.restaurantId}
                id={item.restaurantId}
                name={item.name}
                category={item.category}
                distance={item.distanceMeter}
                image={item.thumbnailImageUrl}
                onClick={onRestaurantClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">추천 맛집이 없습니다</div>
        )}
      </Container>
    </div>
  )
}
