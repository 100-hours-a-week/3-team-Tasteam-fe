let accessToken: string | null = null
let refreshEnabled = false
const listeners = new Set<(token: string | null) => void>()
const loginRequiredListeners = new Set<() => void>()

const notify = () => {
  listeners.forEach((listener) => listener(accessToken))
}

export const getAccessToken = () => {
  return accessToken
}

export const setAccessToken = (token: string | null) => {
  accessToken = token
  notify()
}

export const clearAccessToken = () => {
  accessToken = null
  notify()
}

export const setRefreshEnabled = (enabled: boolean) => {
  refreshEnabled = enabled
}

export const getRefreshEnabled = () => {
  return refreshEnabled
}

export const subscribeAccessToken = (listener: (token: string | null) => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const subscribeLoginRequired = (listener: () => void) => {
  loginRequiredListeners.add(listener)
  return () => {
    loginRequiredListeners.delete(listener)
  }
}

export const notifyLoginRequired = () => {
  loginRequiredListeners.forEach((listener) => listener())
}

const decodeJwtPayload = (token: string) => {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const json = atob(padded)
    return JSON.parse(json) as { exp?: number }
  } catch {
    return null
  }
}

export const getTokenExpiry = (token: string | null) => {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return null
  return payload.exp * 1000
}
