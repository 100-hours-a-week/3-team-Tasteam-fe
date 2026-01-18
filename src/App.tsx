import { useEffect, useState } from 'react'
import { HomePage } from '@/pages/home/HomePage'
import { SplashPage } from '@/pages/splash/SplashPage'
import { useBootstrap } from '@/app/bootstrap/useBootstrap'

function App() {
  const isReady = useBootstrap()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    if (!isReady) {
      return
    }

    const timer = setTimeout(() => setShowSplash(false), 240)
    return () => clearTimeout(timer)
  }, [isReady])

  if (showSplash) {
    return <SplashPage isFadingOut={isReady} />
  }

  return <HomePage />
}

export default App
