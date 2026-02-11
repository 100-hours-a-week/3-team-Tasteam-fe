import { useEffect } from 'react'
import { useAuth } from '@/entities/user'
import { startFcmTokenSync } from './fcm'

export const FcmProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return
    const cleanup = startFcmTokenSync()
    return () => {
      cleanup()
    }
  }, [isAuthenticated])

  return <>{children}</>
}
