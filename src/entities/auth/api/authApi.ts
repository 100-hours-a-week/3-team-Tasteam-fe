import { request } from '@/shared/api/request'
import type {
  AuthTokenRequestDto,
  AuthTokenResponseDto,
  RefreshTokenResponseDto,
} from '../model/dto'

export const issueAccessToken = (payload: AuthTokenRequestDto) =>
  request<AuthTokenResponseDto>({
    method: 'POST',
    url: '/api/v1/auth/token',
    data: payload,
  })

export const refreshAccessToken = (accessToken?: string | null) =>
  request<RefreshTokenResponseDto>({
    method: 'POST',
    url: '/api/v1/auth/token/refresh',
    data: { accessToken: accessToken ?? null },
    withCredentials: true,
  })

export const logout = () =>
  request<void>({
    method: 'DELETE',
    url: '/api/v1/auth/token',
  })
