import { useEffect } from 'react'
import { useAuth } from '@/entities/user'
import { logger } from '@/shared/lib/logger'

export const FcmProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    let isCancelled = false
    let cleanup: (() => void) | undefined

    void import('./fcm')
      .then(({ startFcmTokenSync }) => {
        if (isCancelled) return

        cleanup = startFcmTokenSync()
      })
      .catch((error) => {
        logger.error('[FcmProvider] Failed to start FCM token sync', error)
      })

    return () => {
      isCancelled = true
      try {
        cleanup?.()
      } catch (error) {
        logger.error('[FcmProvider] Failed to cleanup FCM token sync', error)
      }
    }
  }, [isAuthenticated])

  return <>{children}</>
}
