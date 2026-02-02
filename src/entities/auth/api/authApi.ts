import { request } from '@/shared/api/request'
import { refreshClient } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/routes'
import type {
  AuthTokenRequestDto,
  AuthTokenResponseDto,
  RefreshAccessTokenResponseDto,
} from '../model/dto'

export const issueAccessToken = async (payload: AuthTokenRequestDto) => {
  const response = await refreshClient.post<AuthTokenResponseDto>('/api/v1/auth/token', payload)
  return response.data
}

export const refreshAccessToken = async (accessToken?: string | null) => {
  const response = await refreshClient.post<RefreshAccessTokenResponseDto>(
    '/api/v1/auth/token/refresh',
    { accessToken: accessToken ?? null },
  )
  return response.data
}

export const logout = () =>
  request<void>({
    method: 'POST',
    url: API_ENDPOINTS.logout,
  })
