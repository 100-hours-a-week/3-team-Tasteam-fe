import { API_BASE_URL } from '@/shared/config/env'
import { API_ENDPOINTS } from '@/shared/config/routes'

type Provider = 'kakao' | 'google' | 'apple'

export const getOAuthStartUrl = (provider: Provider, redirectUri: string) => {
  const url = new URL(API_ENDPOINTS.oauthStart(provider), API_BASE_URL)
  url.searchParams.set('redirect_uri', redirectUri)
  return url.toString()
}

export const storeReturnPath = (path: string) => {
  sessionStorage.setItem('auth:return_to', path)
}
