import { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/entities/user/model/useAuth'

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const toastShown = useRef(false)

  useEffect(() => {
    if (!isAuthenticated && !toastShown.current) {
      toastShown.current = true
      sessionStorage.setItem('auth:return_to', location.pathname + location.search)
      toast.error('로그인이 필요한 기능입니다')
    }
  }, [isAuthenticated, location])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
