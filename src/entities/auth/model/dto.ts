import type { SuccessResponse } from '@/shared/types/api'
import type { AccessToken, AuthProvider } from './types'

export type AuthTokenRequestDto = {
  provider: AuthProvider
  authorizationCode: string
  redirectUri: string
}

export type AuthTokenResponseDto = SuccessResponse<{ accessToken: AccessToken }>

export type RefreshTokenResponseDto =
  | SuccessResponse<{ accessToken: AccessToken }>
  | { accessToken: AccessToken }
