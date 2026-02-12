import { useEffect } from 'react'
import { useAuth } from '@/entities/user'
import { logger } from '@/shared/lib/logger'
import { startFcmTokenSync } from './fcm'

export const FcmProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    let cleanup: (() => void) | undefined

    try {
      cleanup = startFcmTokenSync()
    } catch (error) {
      logger.error('[FcmProvider] Failed to start FCM token sync', error)
    }

    return () => {
      try {
        cleanup?.()
      } catch (error) {
        logger.error('[FcmProvider] Failed to cleanup FCM token sync', error)
      }
    }
  }, [isAuthenticated])

  return <>{children}</>
}
