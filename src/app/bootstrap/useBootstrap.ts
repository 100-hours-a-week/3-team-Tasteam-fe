import { useEffect, useState } from 'react'
import { bootstrapApp } from './bootstrap'

let hasShownSplash = false

const getInitialReady = () => {
  if (hasShownSplash) {
    return true
  }

  const hasSeenSplash = sessionStorage.getItem('app:seen_splash') === 'true'
  if (hasSeenSplash) {
    hasShownSplash = true
    return true
  }

  return false
}

export const useBootstrap = () => {
  const [isReady, setIsReady] = useState(getInitialReady)

  useEffect(() => {
    let alive = true

    if (isReady) {
      return () => {
        alive = false
      }
    }

    bootstrapApp().then(() => {
      if (alive) {
        sessionStorage.setItem('app:seen_splash', 'true')
        hasShownSplash = true
        setIsReady(true)
      }
    })

    return () => {
      alive = false
    }
  }, [isReady])

  return isReady
}
