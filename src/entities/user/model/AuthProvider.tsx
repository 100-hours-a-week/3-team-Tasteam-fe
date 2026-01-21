import { useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import type { AuthContextValue, User } from './authContext'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/shared/lib/authToken'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setTokenState] = useState<string | null>(getAccessToken())
  const [user, setUser] = useState<User>(null)
  const [showLogin, setShowLogin] = useState(false)

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
