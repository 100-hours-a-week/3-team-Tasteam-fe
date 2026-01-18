import { useEffect, useState } from 'react'
import { bootstrapApp } from './bootstrap'

export const useBootstrap = () => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let alive = true

    bootstrapApp().then(() => {
      if (alive) {
        setIsReady(true)
      }
    })

    return () => {
      alive = false
    }
  }, [])

  return isReady
}
