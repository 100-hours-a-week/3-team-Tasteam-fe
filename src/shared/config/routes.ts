export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
} as const

export const API_ENDPOINTS = {
  tokenRefresh: '/api/v1/auth/token/refresh',
  oauthStart: (provider: string) => `/api/v1/auth/oauth/${provider}`,
  logout: '/api/v1/auth/logout',
  health: '/api/v1/health',
} as const
