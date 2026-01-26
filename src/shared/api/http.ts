import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/shared/config/env'
import { API_ENDPOINTS } from '@/shared/config/routes'
import {
  clearAccessToken,
  getAccessToken,
  getRefreshEnabled,
  notifyLoginRequired,
  setAccessToken,
} from '@/shared/lib/authToken'
import { AUTH_DEBUG } from '@/shared/config/env'
import type { SuccessResponse } from '@/shared/types/api'

type RefreshResponse = SuccessResponse<{ accessToken?: string }>

/**
 * axios 인스턴스를 생성하는 유틸.
 * withCredentials: true를 통해 httpOnly 쿠키(`refreshToken`)가 자동 포함되고,
 * baseURL/timeout/헤더를 한 곳에서 통제합니다.
 */
const createHttpClient = (withCredentials = true) =>
  axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials,
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const http = createHttpClient(true)
const refreshClient = createHttpClient(true)

let refreshPromise: Promise<string | null> | null = null

/**
 * 리프레시 엔드포인트에 accessToken을 제출하고 새 토큰을 받아옴.
 * Promise를 캐싱하여 늦게 들어온 요청들이 중복 호출 없이 동일한 결과를 공유하게 함.
 */
const refreshAccessToken = async (currentToken: string | null) => {
  if (!refreshPromise) {
    if (AUTH_DEBUG) {
      console.debug('[auth] refresh attempt (401)')
    }
    refreshPromise = refreshClient
      .post<RefreshResponse>(API_ENDPOINTS.tokenRefresh, { accessToken: currentToken })
      .then((response) => {
        if (AUTH_DEBUG) {
          console.debug('[auth] refresh response (401)', response.data)
        }
        return response.data.data?.accessToken ?? null
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

/**
 * 모든 요청 시 Authorization 헤더에 현재 accessToken을 주입.
 * 토큰이 존재하지 않으면 아무것도 하지 않습니다.
 */
http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * 401 Unauthorized를 만날 경우 refreshToken으로 accessToken을 재발급 받고,
 * 원래 요청을 새 토큰으로 재시도. refresh 토큰 호출은 재귀 방지를 위해 제외.
 */
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const status = error.response?.status
    const isRefreshCall = originalRequest?.url?.includes(API_ENDPOINTS.tokenRefresh)

    if (status !== 401 || originalRequest?._retry || isRefreshCall) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!getRefreshEnabled()) {
        clearAccessToken()
        notifyLoginRequired()
        return Promise.reject(error)
      }
      const newToken = await refreshAccessToken(getAccessToken())
      if (!newToken) {
        clearAccessToken()
        notifyLoginRequired()
        return Promise.reject(error)
      }

      setAccessToken(newToken)
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${newToken}`

      return http.request(originalRequest)
    } catch (refreshError) {
      clearAccessToken()
      notifyLoginRequired()
      return Promise.reject(refreshError)
    }
  },
)
