/**
 * 애플리케이션의 라우트 및 API 엔드포인트를 정의합니다.
 */
export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  otp: '/otp',
  onboarding: '/onboarding',
  search: '/search',
  locationSelect: '/location-select',
  todayLunch: '/today-lunch',
  groups: '/groups',
  createGroup: '/groups/create',
  groupEmailJoin: (id: string) => `/groups/${id}/email-join`,
  groupPasswordJoin: (id: string) => `/groups/${id}/password-join`,
  subgroupList: '/subgroup-list',
  subgroupCreate: '/subgroups/create',
  groupDetail: (id: string) => `/groups/${id}`,
  subgroupDetail: (id: string) => `/subgroups/${id}`,
  profile: '/profile',
  editProfile: '/my-page/edit',
  favorites: '/favorites',
  myFavorites: '/my-page/favorites',
  myReviews: '/my-page/reviews',
  notifications: '/notifications',
  notificationSettings: '/notifications/settings',
  notices: '/notices',
  events: '/events',
  settings: '/settings',
  restaurantDetail: (id: string) => `/restaurants/${id}`,
  writeReview: (restaurantId: string) => `/restaurants/${restaurantId}/review`,
  chatRoom: (roomId: string) => `/chat/${roomId}`,
} as const

/**
 * API 엔드포인트를 정의합니다.
 */
export const API_ENDPOINTS = {
  tokenRefresh: '/api/v1/auth/token/refresh',
  oauthStart: (provider: string) => `/api/v1/auth/oauth/${provider}`,
  logout: '/api/v1/auth/logout',
  health: '/api/v1/health',
} as const
