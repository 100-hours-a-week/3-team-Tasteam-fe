import { createContext } from 'react'

export type User = {
  id: string
  name: string
} | null

export type AuthContextValue = {
  accessToken: string | null
  user: User
  isAuthenticated: boolean
  showLogin: boolean
  openLogin: () => void
  closeLogin: () => void
  loginWithToken: (token: string, user?: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
