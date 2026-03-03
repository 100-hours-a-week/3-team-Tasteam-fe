import { X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { SplashEventDto } from '@/entities/main'

type SplashPopupCloseOptions = {
  dontShowToday: boolean
}

type SplashPopupProps = {
  event: SplashEventDto
  isOpen: boolean
  onClose: (options: SplashPopupCloseOptions) => void
  onLinkClick?: () => void
}

export function SplashPopup({ event, isOpen, onClose, onLinkClick }: SplashPopupProps) {
  if (!isOpen) return null

  const handleClose = () => {
    onClose({ dontShowToday: false })
  }

  const handleLinkClick = () => {
    onClose({ dontShowToday: false })
    onLinkClick?.()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm bg-background rounded-2xl overflow-hidden shadow-xl"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {event.detailImageUrls?.[0] && (
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <img
              src={event.detailImageUrls[0]}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 space-y-2">
          <Button onClick={handleLinkClick} className="w-full" size="lg">
            이벤트 보러가기
          </Button>
          <Button onClick={handleClose} variant="outline" className="w-full" size="lg">
            닫기
          </Button>
        </div>
      </div>
    </div>
  )
}
