import { useEffect, useState } from 'react'
import { bootstrapApp } from './bootstrap'

const getInitialReady = () => {
  const hasSeenSplash = sessionStorage.getItem('app:seen_splash') === 'true'
  return hasSeenSplash
}

export const useBootstrap = () => {
  const [isReady, setIsReady] = useState(getInitialReady)

  useEffect(() => {
    let alive = true

    // Ensure bootstrapApp is always called unconditionally on mount.
    // The `isReady` state will now only reflect the completion of bootstrapping.
    bootstrapApp().then(() => {
      if (alive) {
        sessionStorage.setItem('app:seen_splash', 'true')
        setIsReady(true)
      }
    })

    return () => {
      alive = false
    }
  }, []) // Run only once on mount

  return isReady
}
