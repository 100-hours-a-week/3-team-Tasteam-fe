import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/entities/user'
import { request } from '@/shared/api/request'
import { API_ENDPOINTS } from '@/shared/config/routes'
import styles from './OAuthCallbackPage.module.css'

type RefreshResponse = {
  accessToken?: string
  data?: {
    accessToken?: string
  }
}

export const OAuthCallbackPage = () => {
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()
  const requestRef = useRef<Promise<RefreshResponse> | null>(null)
  const handledRef = useRef(false)

  useEffect(() => {
    const returnTo = sessionStorage.getItem('auth:return_to') ?? '/'

    if (!requestRef.current) {
      requestRef.current = request<RefreshResponse>({
        method: 'POST',
        url: API_ENDPOINTS.tokenRefresh,
        data: { accessToken: null },
        withCredentials: true,
      })
    }

    requestRef.current
      .then((data) => {
        if (handledRef.current) {
          return
        }
        handledRef.current = true
        const token = data.accessToken ?? data.data?.accessToken
        if (token) {
          loginWithToken(token)
          sessionStorage.removeItem('auth:return_to')
          sessionStorage.setItem('auth:back_guard', '1')
          navigate(returnTo, { replace: true })
          return
        }
        navigate('/error', { replace: true })
      })
      .catch(() => {
        if (handledRef.current) {
          return
        }
        handledRef.current = true
        navigate('/error', { replace: true })
      })

    return () => {}
  }, [loginWithToken, navigate])

  return <div className={styles.hidden} aria-hidden="true" />
}
