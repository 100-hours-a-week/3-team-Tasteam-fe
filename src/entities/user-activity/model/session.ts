import type { PageContext } from './types'

const SESSION_ID_STORAGE_KEY = 'activity:session-id:v1'

const PATH_RULES: Array<{ regex: RegExp; pageKey: string; pathTemplate: string }> = [
  { regex: /^\/$/, pageKey: 'home', pathTemplate: '/' },
  { regex: /^\/oauth\/callback$/, pageKey: 'oauth_callback', pathTemplate: '/oauth/callback' },
  { regex: /^\/login$/, pageKey: 'login', pathTemplate: '/login' },
  { regex: /^\/signup$/, pageKey: 'signup', pathTemplate: '/signup' },
  { regex: /^\/otp$/, pageKey: 'otp', pathTemplate: '/otp' },
  { regex: /^\/onboarding$/, pageKey: 'onboarding', pathTemplate: '/onboarding' },
  { regex: /^\/search$/, pageKey: 'search', pathTemplate: '/search' },
  { regex: /^\/favorites$/, pageKey: 'favorites', pathTemplate: '/favorites' },
  { regex: /^\/location-select$/, pageKey: 'location_select', pathTemplate: '/location-select' },
  { regex: /^\/today-lunch$/, pageKey: 'today_lunch', pathTemplate: '/today-lunch' },
  { regex: /^\/groups$/, pageKey: 'groups', pathTemplate: '/groups' },
  { regex: /^\/groups\/create$/, pageKey: 'group_create', pathTemplate: '/groups/create' },
  { regex: /^\/groups\/[^/]+$/, pageKey: 'group_detail', pathTemplate: '/groups/:id' },
  {
    regex: /^\/groups\/[^/]+\/email-join$/,
    pageKey: 'group_email_join',
    pathTemplate: '/groups/:id/email-join',
  },
  {
    regex: /^\/groups\/[^/]+\/password-join$/,
    pageKey: 'group_password_join',
    pathTemplate: '/groups/:id/password-join',
  },
  { regex: /^\/subgroup-list$/, pageKey: 'subgroup_list', pathTemplate: '/subgroup-list' },
  {
    regex: /^\/subgroups\/create$/,
    pageKey: 'subgroup_create',
    pathTemplate: '/subgroups/create',
  },
  { regex: /^\/subgroups\/[^/]+$/, pageKey: 'subgroup_detail', pathTemplate: '/subgroups/:id' },
  { regex: /^\/profile$/, pageKey: 'profile', pathTemplate: '/profile' },
  { regex: /^\/my-page\/edit$/, pageKey: 'my_page_edit', pathTemplate: '/my-page/edit' },
  {
    regex: /^\/my-page\/favorites$/,
    pageKey: 'my_page_favorites',
    pathTemplate: '/my-page/favorites',
  },
  {
    regex: /^\/my-page\/reviews$/,
    pageKey: 'my_page_reviews',
    pathTemplate: '/my-page/reviews',
  },
  { regex: /^\/notifications$/, pageKey: 'notifications', pathTemplate: '/notifications' },
  {
    regex: /^\/notifications\/settings$/,
    pageKey: 'notification_settings',
    pathTemplate: '/notifications/settings',
  },
  { regex: /^\/settings$/, pageKey: 'settings', pathTemplate: '/settings' },
  { regex: /^\/notices$/, pageKey: 'notices', pathTemplate: '/notices' },
  { regex: /^\/events$/, pageKey: 'events', pathTemplate: '/events' },
  { regex: /^\/events\/[^/]+$/, pageKey: 'event_detail', pathTemplate: '/events/:id' },
  {
    regex: /^\/restaurants\/[^/]+$/,
    pageKey: 'restaurant_detail',
    pathTemplate: '/restaurants/:id',
  },
  {
    regex: /^\/restaurants\/[^/]+\/review$/,
    pageKey: 'review_write',
    pathTemplate: '/restaurants/:id/review',
  },
  {
    regex: /^\/restaurants\/[^/]+\/reviews$/,
    pageKey: 'restaurant_reviews',
    pathTemplate: '/restaurants/:id/reviews',
  },
  { regex: /^\/chat\/[^/]+$/, pageKey: 'chat_room', pathTemplate: '/chat/:roomId' },
  { regex: /^\/error$/, pageKey: 'error', pathTemplate: '/error' },
]

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `sid-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

const normalizeSegment = (segment: string) => {
  if (!segment) return segment
  if (/^\d+$/.test(segment)) return ':id'
  if (/^[0-9a-f]{8,}$/i.test(segment)) return ':id'
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(segment)) {
    return ':id'
  }
  return segment
}

const sanitizePageKey = (pathTemplate: string) => {
  if (pathTemplate === '/') return 'home'
  return pathTemplate
    .replaceAll('/:id', '')
    .replaceAll('/:roomId', '')
    .replaceAll('/', '_')
    .replace(/^_/, '')
    .replace(/_+/g, '_')
}

export const getOrCreateActivitySessionId = () => {
  try {
    const existing = sessionStorage.getItem(SESSION_ID_STORAGE_KEY)
    if (existing) {
      return existing
    }
    const sessionId = generateId()
    sessionStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId)
    return sessionId
  } catch {
    return generateId()
  }
}

export const normalizePathTemplate = (pathname: string) => {
  if (!pathname || pathname === '/') {
    return '/'
  }
  const normalizedSegments = pathname.split('/').map(normalizeSegment)
  const normalized = normalizedSegments.join('/')
  return normalized.startsWith('/') ? normalized : `/${normalized}`
}

export const resolvePageContext = (pathname: string): PageContext => {
  for (const rule of PATH_RULES) {
    if (rule.regex.test(pathname)) {
      return {
        pageKey: rule.pageKey,
        pathTemplate: rule.pathTemplate,
      }
    }
  }

  const pathTemplate = normalizePathTemplate(pathname || '/')
  return {
    pageKey: sanitizePageKey(pathTemplate),
    pathTemplate,
  }
}

export const getCurrentPageContext = (): PageContext => {
  if (typeof window === 'undefined') {
    return {
      pageKey: 'unknown',
      pathTemplate: '/',
    }
  }
  return resolvePageContext(window.location.pathname)
}
