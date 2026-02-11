import { X } from 'lucide-react'
import { Button } from '@/shared/ui/button'

type SplashPopupProps = {
  isOpen: boolean
  onClose: () => void
  image?: string
  title?: string
  description?: string
  link?: string
  linkText?: string
  onLinkClick?: () => void
}

export function SplashPopup({
  isOpen,
  onClose,
  image,
  title = '신규 이벤트',
  description = 'Tasteam과 함께 맛집을 찾아보세요!',
  link,
  linkText = '자세히 보기',
  onLinkClick,
}: SplashPopupProps) {
  if (!isOpen) return null

  const handleLinkClick = () => {
    onLinkClick?.()
    onClose()
  }

  const handleDontShowToday = (checked: boolean) => {
    if (checked) {
      const today = new Date().toDateString()
      localStorage.setItem('splash-popup-dismissed-date', today)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm bg-background rounded-2xl overflow-hidden shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {image && (
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-center text-lg font-semibold">{title}</h3>
            <p className="text-center text-muted-foreground">{description}</p>
          </div>

          <div className="space-y-2">
            {link && (
              <Button onClick={handleLinkClick} className="w-full" size="lg">
                {linkText}
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="w-full" size="lg">
              닫기
            </Button>
          </div>

          <label className="flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              onChange={(e) => handleDontShowToday(e.target.checked)}
            />
            <span className="text-sm text-muted-foreground">오늘 하루 보지 않기</span>
          </label>
        </div>
      </div>
    </div>
  )
}
