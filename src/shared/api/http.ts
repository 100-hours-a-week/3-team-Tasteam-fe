import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/shared/config/env'
import { API_ENDPOINTS } from '@/shared/config/routes'
import {
  clearAccessToken,
  getAccessToken,
  getRefreshEnabled,
  setAccessToken,
} from '@/shared/lib/authToken'
import { logger } from '@/shared/lib/logger'
import type { SuccessResponse } from '@/shared/types/api'

type RefreshResponse = SuccessResponse<{ accessToken?: string }>

const PUBLIC_ENDPOINTS = ['/api/v1/main', '/api/v1/promotions', '/api/v1/announcements']

const isPublicEndpoint = (url?: string) => {
  if (!url) return false
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint))
}

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
export const refreshClient = createHttpClient(true)

let refreshPromise: Promise<string | null> | null = null

/**
 * 리프레시 엔드포인트에 accessToken을 제출하고 새 토큰을 받아옴.
 * Promise를 캐싱하여 늦게 들어온 요청들이 중복 호출 없이 동일한 결과를 공유하게 함.
 */
const refreshAccessToken = async (currentToken: string | null) => {
  if (!refreshPromise) {
    logger.debug('[인증] 리프레시 시도 (401)', { currentTokenExists: !!currentToken })
    refreshPromise = refreshClient
      .post<RefreshResponse>(API_ENDPOINTS.tokenRefresh, { accessToken: currentToken })
      .then((response) => {
        logger.debug('[인증] 리프레시 응답 (401)', response.data)
        return response.data.data?.accessToken ?? null
      })
      .finally(() => {
        refreshPromise = null
        logger.debug('[인증] refreshPromise 초기화됨')
      })
  } else {
    logger.debug('[인증] refreshPromise 존재, 대기 중...')
  }

  return refreshPromise
}

/**
 * 모든 요청 시 Authorization 헤더에 현재 accessToken을 주입.
 * PUBLIC 엔드포인트는 토큰을 추가하지 않습니다.
 */
http.interceptors.request.use(
  (config) => {
    const isPublic = isPublicEndpoint(config.url)
    const token = getAccessToken()

    if (!isPublic && token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
      logger.debug(`[HTTP] ${config.url}로 요청 전송`, {
        method: config.method,
        tokenExists: !!token,
        hasAuthHeader: !!config.headers.Authorization,
      })
    } else {
      logger.debug(`[HTTP] ${config.url}로 요청 전송 (${isPublic ? 'PUBLIC' : '토큰 없음'})`, {
        method: config.method,
        isPublic,
      })
    }
    return config
  },
  (error) => {
    logger.error('[HTTP] 요청 오류:', error)
    return Promise.reject(error)
  },
)

/**
 * 401 Unauthorized를 만날 경우 refreshToken으로 accessToken을 재발급 받고,
 * 원래 요청을 새 토큰으로 재시도. refresh 토큰 호출은 재귀 방지를 위해 제외.
 * PUBLIC 엔드포인트는 토큰 리프레시를 시도하지 않습니다.
 */
http.interceptors.response.use(
  (response) => {
    logger.debug(`[HTTP] ${response.config.url}에서 응답 수신`, {
      status: response.status,
      method: response.config.method,
      data: response.data,
    })
    return response
  },
  async (error) => {
    const errorResponse = error.response
    const errorData = errorResponse?.data
    logger.error(`[HTTP] ${error.config?.url}에서 오류 응답`, {
      status: errorResponse?.status,
      method: error.config?.method,
      code: errorData?.code,
      message: errorData?.message,
      errors: errorData?.errors,
    })

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const status = errorResponse?.status
    const isRefreshCall = originalRequest?.url?.includes(API_ENDPOINTS.tokenRefresh)
    const isPublic = isPublicEndpoint(originalRequest?.url)

    logger.debug('[인증] 인터셉터 401 확인:', {
      status,
      isRetry: originalRequest?._retry,
      isRefreshCall,
      isPublic,
      getRefreshEnabled: getRefreshEnabled(),
    })

    if (isPublic) {
      logger.debug('[인증] PUBLIC 엔드포인트, 리프레시 스킵')
      return Promise.reject(error)
    }

    if (status === 401 && errorData?.code === 'REFRESH_TOKEN_NOT_FOUND') {
      logger.debug('[인증] REFRESH_TOKEN_NOT_FOUND 에러, accessToken 제거')
      clearAccessToken()
      return Promise.reject(error)
    }

    if (status === 401 && errorData?.code === 'MEMBER_INACTIVE') {
      logger.debug('[인증] MEMBER_INACTIVE 에러')
      toast.error('이미 탈퇴된 회원입니다')
      clearAccessToken()
      return Promise.reject(error)
    }

    if (status !== 401 || originalRequest?._retry || isRefreshCall) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!getRefreshEnabled()) {
        logger.debug('[인증] 리프레시 비활성화, 토큰 제거.')
        clearAccessToken()
        return Promise.reject(error)
      }

      logger.debug('[인증] 토큰 리프레시 시도 중...')
      const newToken = await refreshAccessToken(getAccessToken())
      if (!newToken) {
        logger.debug('[인증] 리프레시 후 새 토큰 획득 실패, 제거.')
        clearAccessToken()
        return Promise.reject(error)
      }

      logger.debug('[인증] 새 토큰 수신, 설정 후 원래 요청 재시도.')
      setAccessToken(newToken)
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${newToken}`

      return http.request(originalRequest)
    } catch (refreshError) {
      logger.error('[인증] 토큰 리프레시가 예상치 않게 실패함:', refreshError)
      clearAccessToken()
      return Promise.reject(refreshError)
    }
  },
)
