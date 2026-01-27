import { logger } from '@/shared/lib/logger'

let accessToken: string | null = null
let refreshEnabled = false
const listeners = new Set<(token: string | null) => void>()
const loginRequiredListeners = new Set<() => void>()
let loginRequiredFired = false

const notify = () => {
  listeners.forEach((listener) => listener(accessToken))
}

/// 현재 저장된 accessToken을 반환합니다.
export const getAccessToken = () => {
  return accessToken
}

/// accessToken을 설정하고 구독자들에게 알립니다.
export const setAccessToken = (token: string | null) => {
  accessToken = token
  logger.debug('[auth] Access Token set:', token ? 'exists' : 'null')
  notify()
}

/// accessToken을 삭제하고 구독자들에게 알립니다.
export const clearAccessToken = () => {
  accessToken = null
  logger.debug('[auth] Access Token cleared')
  notify()
}

/// 리프레시 토큰 사용 여부를 설정합니다.
export const setRefreshEnabled = (enabled: boolean) => {
  refreshEnabled = enabled
  logger.debug('[auth] Refresh Enabled set to:', enabled)
}

/// 리프레시 토큰 사용 여부를 반환합니다.
export const getRefreshEnabled = () => {
  return refreshEnabled
}

/// accessToken 변경을 구독합니다.
export const subscribeAccessToken = (listener: (token: string | null) => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/// 로그인 필요 이벤트를 구독합니다.
export const subscribeLoginRequired = (listener: () => void) => {
  loginRequiredListeners.add(listener)
  return () => {
    loginRequiredListeners.delete(listener)
  }
}

/// 로그인 필요 이벤트를 알립니다.
export const notifyLoginRequired = () => {
  if (loginRequiredFired) return
  loginRequiredFired = true
  logger.debug('[auth] Login Required triggered')
  loginRequiredListeners.forEach((listener) => listener())
}

/// 로그인 필요 상태를 리셋합니다.
export const resetLoginRequired = () => {
  loginRequiredFired = false
  logger.debug('[auth] Login Required reset')
}

/// JWT 페이로드를 디코딩합니다.
const decodeJwtPayload = (token: string) => {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const json = atob(padded)
    return JSON.parse(json) as { exp?: number }
  } catch (e) {
    logger.debug('[auth] JWT decoding error:', e)
    return null
  }
}

/// 토큰의 만료 시간을 밀리초 단위로 반환합니다.
export const getTokenExpiry = (token: string | null) => {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return null
  return payload.exp * 1000
}
