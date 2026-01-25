import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

type SplashPageProps = {
  isFadingOut?: boolean
  onLoadComplete?: () => void
}

export function SplashPage({ isFadingOut = false, onLoadComplete }: SplashPageProps) {
  useEffect(() => {
    if (onLoadComplete) {
      const timer = setTimeout(() => {
        onLoadComplete()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [onLoadComplete])

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center">
            <span className="text-5xl font-bold text-primary">T</span>
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-white/20 -z-10 blur-xl"></div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Tasteam</h1>
          <p className="text-white/90">맛집을 탐색하고 공유하세요</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <p className="text-sm text-white/80">로딩 중...</p>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-white/60">© 2024 Tasteam. All rights reserved.</p>
      </div>
    </div>
  )
}
