import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import type { AuthContextValue, User } from './authContext'
import {
  clearAccessToken,
  getAccessToken,
  getRefreshEnabled,
  getTokenExpiry,
  resetLoginRequired,
  setAccessToken,
  subscribeAccessToken,
  subscribeLoginRequired,
} from '@/shared/lib/authToken'
import { logout as logoutApi, refreshAccessToken } from '@/entities/auth'
import { logger } from '@/shared/lib/logger'

const extractAccessToken = (data: { data: { accessToken?: string } }) =>
  data.data.accessToken ?? null

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
    logger.debug('[auth] accessToken exp(ms):', expiresAt)
    if (!expiresAt) return

    const refreshAt = expiresAt - 60_000
    logger.debug('[auth] refresh scheduled at:', new Date(refreshAt).toISOString())
    const delay = Math.max(refreshAt - Date.now(), 1000)
    logger.debug('[auth] refresh timer registered')
    const timeoutId = window.setTimeout(async () => {
      logger.debug('[auth] refresh attempt (timer)')
      try {
        const data = await refreshAccessToken(accessToken)
        const newToken = extractAccessToken(data)
        if (newToken) {
          logger.debug('[auth] refresh success (timer)')
          setAccessToken(newToken)
          setTokenState(newToken)
          setShowLogin(false)
          return
        }
      } catch {
        logger.debug('[auth] refresh failed (timer)')
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
        resetLoginRequired()
        setShowLogin(false)
      },
      logout: async () => {
        try {
          await logoutApi()
        } catch {
          logger.debug('[auth] logout failed')
          return false
        }
        clearAccessToken()
        setTokenState(null)
        setUser(null)
        resetLoginRequired()
        setShowLogin(false)
        return true
      },
    }),
    [accessToken, showLogin, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
