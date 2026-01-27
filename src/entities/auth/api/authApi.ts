import { request } from '@/shared/api/request'
import { API_ENDPOINTS } from '@/shared/config/routes'
import type {
  AuthTokenRequestDto,
  AuthTokenResponseDto,
  RefreshAccessTokenResponseDto,
} from '../model/dto'

export const issueAccessToken = (payload: AuthTokenRequestDto) =>
  request<AuthTokenResponseDto>({
    method: 'POST',
    url: '/api/v1/auth/token',
    data: payload,
  })

export const refreshAccessToken = (accessToken?: string | null) =>
  request<RefreshAccessTokenResponseDto>({
    method: 'POST',
    url: '/api/v1/auth/token/refresh',
    data: { accessToken: accessToken ?? null },
    withCredentials: true,
  })

export const logout = () =>
  request<void>({
    method: 'POST',
    url: API_ENDPOINTS.logout,
  })
