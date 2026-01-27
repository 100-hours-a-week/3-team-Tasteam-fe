import { mockRequest } from '@/shared/api/mockRequest'
import { API_ENDPOINTS } from '@/shared/config/routes'
import type {
  AuthTokenRequestDto,
  AuthTokenResponseDto,
  RefreshAccessTokenResponseDto,
} from '../model/dto'

export const issueAccessToken = (payload: AuthTokenRequestDto) =>
  mockRequest<AuthTokenResponseDto>({
    method: 'POST',
    url: '/api/v1/auth/token',
    data: payload,
  })

export const refreshAccessToken = (accessToken?: string | null) =>
  mockRequest<RefreshAccessTokenResponseDto>({
    method: 'POST',
    url: '/api/v1/auth/token/refresh',
    data: { accessToken: accessToken ?? null },
    withCredentials: true,
  })

export const logout = () =>
  mockRequest<void>({
    method: 'POST',
    url: API_ENDPOINTS.logout,
  })
