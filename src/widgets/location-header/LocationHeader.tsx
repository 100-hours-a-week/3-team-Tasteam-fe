import { MapPin, ChevronRight } from 'lucide-react'
import { Container } from '@/widgets/container'

type LocationHeaderProps = {
  district?: string
  onLocationClick?: () => void
}

export function LocationHeader({
  district = '위치를 선택하세요',
  onLocationClick,
}: LocationHeaderProps) {
  return (
    <div className="border-b">
      <Container className="pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Tasteam</h1>
          {onLocationClick ? (
            <button
              className="flex items-center gap-1 hover:bg-secondary/50 rounded-lg px-2 py-1 transition-colors"
              onClick={onLocationClick}
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{district}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{district}</span>
            </div>
          )}
          {/* 알림 버튼 - 추후 활성화
        <Button variant="ghost" size="icon" onClick={onNotificationClick}>
          <Bell className="h-5 w-5" />
        </Button>
        */}
        </div>
      </Container>
    </div>
  )
}
