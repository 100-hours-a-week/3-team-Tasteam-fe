import { useEffect, useState } from 'react'
import { HealthStatusIndicator } from '@/widgets/health-status/HealthStatusIndicator'
import { AuthStatusIndicator } from '@/widgets/auth-status/AuthStatusIndicator'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'

export function DebugIndicators() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState<boolean>(FEATURE_FLAGS.enableDebugTools)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'd') {
        event.preventDefault()
        setIsVisible((prev) => !prev)
      }
      if (key === 'escape') {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      {isVisible && <HealthStatusIndicator />}
      {isVisible && <AuthStatusIndicator />}
      <div className="fixed top-3 left-3 z-50">
        <button
          type="button"
          className="rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background shadow transition-opacity hover:opacity-100 opacity-70"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="디버그 상태 토글 메뉴"
        >
          디버그
        </button>
        {isMenuOpen && (
          <div className="mt-2 w-44 rounded-md border border-border bg-background shadow-lg">
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={() => {
                setIsVisible((prev) => !prev)
                setIsMenuOpen(false)
              }}
            >
              {isVisible ? '상태 숨기기' : '상태 표시'}
            </button>
            <div className="px-3 pb-2 text-[11px] text-muted-foreground">
              단축키: Ctrl/⌘ + Shift + D
            </div>
          </div>
        )}
      </div>
    </>
  )
}
