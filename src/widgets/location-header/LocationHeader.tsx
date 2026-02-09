import { MapPin, ChevronRight } from 'lucide-react'
import { Container } from '@/shared/ui/container'

type LocationHeaderProps = {
  district?: string
  address?: string
  onLocationClick?: () => void
}

const formatAddressLines = (address?: string) => {
  if (!address) return { line1: '', line2: '' }
  const commaParts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => part !== '대한민국')
    .filter((part) => !/^\d+$/.test(part))
  const parts = commaParts.length > 0 ? commaParts : address.split(' ').map((p) => p.trim())
  const lastThree = parts.slice(-3)
  const [level1 = '', level2 = '', level3 = ''] = lastThree
  const line1 = level1.replace(/([가-힣])(\d)/g, '$1 $2')
  const line2 = [level3, level2].filter(Boolean).join(' ')
  return { line1, line2 }
}

export function LocationHeader({
  district = '위치를 선택하세요',
  address,
  onLocationClick,
}: LocationHeaderProps) {
  const { line1, line2 } = formatAddressLines(address)
  return (
    <div className="border-b">
      <Container className="pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Tasteam</h1>
          {onLocationClick ? (
            <button
              className="ml-auto flex items-center gap-2 hover:bg-secondary/50 rounded-lg px-2 py-1 transition-colors"
              onClick={onLocationClick}
            >
              <MapPin className="h-4 w-4 text-primary" />
              <div className="min-w-0 max-w-[220px] text-left">
                <div className="text-sm font-medium truncate">{line1 || district}</div>
                <div className="text-xs text-muted-foreground truncate min-h-[1rem]">{line2}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ) : (
            <div className="ml-auto flex items-center gap-2 px-2 py-1">
              <MapPin className="h-4 w-4 text-primary" />
              <div className="min-w-0 max-w-[220px] text-left">
                <div className="text-sm font-medium truncate">{line1 || district}</div>
                <div className="text-xs text-muted-foreground truncate min-h-[1rem]">{line2}</div>
              </div>
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
