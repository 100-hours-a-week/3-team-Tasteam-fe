import { useEffect, useState } from 'react'
import { bootstrapApp } from './bootstrap'
import { getAccessToken } from '@/shared/lib/authToken'

const getInitialReady = () => !!getAccessToken()

export const useBootstrap = () => {
  const [isReady, setIsReady] = useState(getInitialReady)

  useEffect(() => {
    if (isReady) return // 토큰 있음 → bootstrap 불필요

    let alive = true
    bootstrapApp().then(() => {
      if (alive) setIsReady(true)
    })
    return () => {
      alive = false
    }
  }, [isReady])

  return isReady
}
