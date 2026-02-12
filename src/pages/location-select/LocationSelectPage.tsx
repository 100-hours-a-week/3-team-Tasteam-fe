import { useState } from 'react'
import { ChevronLeft, MapPin, Navigation, Search } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Container } from '@/shared/ui/container'
import { useAppLocation } from '@/entities/location'

type LocationSelectPageProps = {
  onBack?: () => void
  onLocationSelect?: (location: {
    district: string
    address: string
    lat: number
    lng: number
  }) => void
}

const recentLocations = [
  { district: '강남구 역삼동', address: '서울특별시 강남구 역삼동', lat: 37.5, lng: 127.0 },
  { district: '서초구 서초동', address: '서울특별시 서초구 서초동', lat: 37.49, lng: 127.01 },
  { district: '송파구 잠실동', address: '서울특별시 송파구 잠실동', lat: 37.51, lng: 127.08 },
]

export function LocationSelectPage({ onBack, onLocationSelect }: LocationSelectPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { requestCurrentLocation, setManualLocation } = useAppLocation()

  const handleCurrentLocation = async () => {
    const updated = await requestCurrentLocation()
    if (!updated) return
    onLocationSelect?.({
      district: updated.district,
      address: updated.address,
      lat: updated.latitude,
      lng: updated.longitude,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <Container className="py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">위치 선택</h1>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="주소 또는 동네 검색"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 mb-6"
          onClick={handleCurrentLocation}
        >
          <Navigation className="h-5 w-5 text-primary" />
          <span>현재 위치로 설정</span>
        </Button>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">최근 위치</h2>
          {recentLocations.map((location, index) => (
            <button
              key={index}
              className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
              onClick={() => {
                setManualLocation({
                  district: location.district,
                  address: location.address,
                  latitude: location.lat,
                  longitude: location.lng,
                })
                onLocationSelect?.(location)
              }}
            >
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{location.district}</div>
                <div className="text-sm text-muted-foreground">{location.address}</div>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </div>
  )
}
