// import { AUTH_DEBUG } from '@/shared/config/env' // Removed import

let accessToken: string | null = null
let refreshEnabled = false
const listeners = new Set<(token: string | null) => void>()
const loginRequiredListeners = new Set<() => void>()
let loginRequiredFired = false

const notify = () => {
  listeners.forEach((listener) => listener(accessToken))
}

export const getAccessToken = () => {
  return accessToken
}

export const setAccessToken = (token: string | null) => {
  accessToken = token
  console.debug('[auth] Access Token set:', token ? 'exists' : 'null') // Made unconditional
  notify()
}

export const clearAccessToken = () => {
  accessToken = null
  console.debug('[auth] Access Token cleared') // Made unconditional
  notify()
}

export const setRefreshEnabled = (enabled: boolean) => {
  refreshEnabled = enabled
  console.debug('[auth] Refresh Enabled set to:', enabled) // Made unconditional
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
  if (loginRequiredFired) return
  loginRequiredFired = true
  console.debug('[auth] Login Required triggered') // Made unconditional
  loginRequiredListeners.forEach((listener) => listener())
}

export const resetLoginRequired = () => {
  loginRequiredFired = false
  console.debug('[auth] Login Required reset') // Made unconditional
}

const decodeJwtPayload = (token: string) => {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const json = atob(padded)
    return JSON.parse(json) as { exp?: number }
  } catch (e) {
    console.debug('[auth] JWT decoding error:', e) // Made unconditional
    return null
  }
}

export const getTokenExpiry = (token: string | null) => {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return null
  return payload.exp * 1000
}
