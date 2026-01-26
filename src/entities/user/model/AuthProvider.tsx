import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import type { AuthContextValue, User } from './authContext'
import {
  clearAccessToken,
  getAccessToken,
  getRefreshEnabled,
  getTokenExpiry,
  setAccessToken,
  subscribeAccessToken,
  subscribeLoginRequired,
} from '@/shared/lib/authToken'
import { refreshAccessToken } from '@/entities/auth/api/authApi'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setTokenState] = useState<string | null>(getAccessToken())
  const [user, setUser] = useState<User>(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    return subscribeAccessToken((token) => {
      setTokenState(token)
    })
  }, [])

  useEffect(() => {
    return subscribeLoginRequired(() => {
      setShowLogin(true)
    })
  }, [])

  useEffect(() => {
    if (!accessToken) return
    if (!getRefreshEnabled()) return

    const expiresAt = getTokenExpiry(accessToken)
    if (!expiresAt) return

    const refreshAt = expiresAt - 90_000
    const delay = Math.max(refreshAt - Date.now(), 1000)
    const timeoutId = window.setTimeout(async () => {
      try {
        const data = await refreshAccessToken(accessToken)
        const newToken = data.accessToken ?? data.data?.accessToken
        if (newToken) {
          setAccessToken(newToken)
          setTokenState(newToken)
          setShowLogin(false)
          return
        }
      } catch {
        // fall through to show login
      }
      clearAccessToken()
      setTokenState(null)
      setUser(null)
      setShowLogin(true)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [accessToken])

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken),
      showLogin,
      openLogin: () => setShowLogin(true),
      closeLogin: () => setShowLogin(false),
      loginWithToken: (token, userValue = null) => {
        setAccessToken(token)
        setTokenState(token)
        setUser(userValue)
        setShowLogin(false)
      },
      logout: () => {
        clearAccessToken()
        setTokenState(null)
        setUser(null)
        setShowLogin(false)
      },
    }),
    [accessToken, showLogin, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
