import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/entities/user/model/useAuth'
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
  const { loginWithToken, openLogin } = useAuth()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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
          navigate(returnTo, { replace: true })
          return
        }
        setErrorMessage('액세스 토큰을 가져오지 못했습니다.')
        openLogin()
      })
      .catch(() => {
        if (handledRef.current) {
          return
        }
        handledRef.current = true
        setErrorMessage('로그인 처리 중 오류가 발생했습니다.')
        openLogin()
      })

    return () => {}
  }, [loginWithToken, openLogin])

  if (!errorMessage) {
    return <div className={styles.hidden} aria-hidden="true" />
  }

  return (
    <main className={styles.error}>
      <h1 className={styles.title}>로그인 처리 실패</h1>
      <p className={styles.message}>{errorMessage}</p>
    </main>
  )
}
