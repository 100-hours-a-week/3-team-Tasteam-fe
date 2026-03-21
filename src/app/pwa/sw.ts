/// <reference lib="webworker" />

import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<string | { url: string; revision?: string | null }>
}

const APP_CACHE_PREFIX = 'tasteam'
const APP_CACHE_VERSION = String(__APP_VERSION__ ?? 'dev')
const PAGE_CACHE_NAME = `${APP_CACHE_PREFIX}-${APP_CACHE_VERSION}-pages`
const IMAGE_CACHE_NAME = `${APP_CACHE_PREFIX}-${APP_CACHE_VERSION}-images`
const NAVIGATION_DENYLIST = [/^\/api\//, /^\/admin/]
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60
const NETWORK_TIMEOUT_SECONDS = 8
const PROFILE_IMAGE_PATH_PATTERN = /\/profile(?:s)?\//i
const PROFILE_IMAGE_KEYWORD_PATTERN =
  /(profile-image|profile_image|profileimage|memberprofileimage)/i

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

const navigationFallback = createHandlerBoundToURL('/index.html')
const pageNavigationStrategy = new NetworkFirst({
  cacheName: PAGE_CACHE_NAME,
  networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: THIRTY_DAYS_IN_SECONDS,
    }),
  ],
})

registerRoute(
  new NavigationRoute(
    async ({ request, event, url }) => {
      try {
        const response = await pageNavigationStrategy.handle({ request, event, url })
        if (response) {
          return response
        }
      } catch (error) {
        console.debug('[sw] 네비게이션 네트워크 응답 실패. 캐시 fallback으로 전환합니다.', error)
      }

      const cache = await caches.open(PAGE_CACHE_NAME)
      const cachedResponse = await cache.match(request)
      if (cachedResponse) return cachedResponse

      return navigationFallback({ request, event, url })
    },
    {
      denylist: NAVIGATION_DENYLIST,
    },
  ),
)

registerRoute(
  ({ request, url }) => {
    const isImageRequest =
      request.destination === 'image' || /\.(png|jpg|jpeg|webp|svg)$/i.test(url.pathname)
    if (!isImageRequest) return false

    const normalizedPath = url.pathname.toLowerCase()
    const normalizedSearch = url.search.toLowerCase()
    const isProfileImageRequest =
      PROFILE_IMAGE_PATH_PATTERN.test(normalizedPath) ||
      PROFILE_IMAGE_KEYWORD_PATTERN.test(normalizedPath) ||
      PROFILE_IMAGE_KEYWORD_PATTERN.test(normalizedSearch)

    return !isProfileImageRequest
  },
  new CacheFirst({
    cacheName: IMAGE_CACHE_NAME,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: THIRTY_DAYS_IN_SECONDS,
      }),
    ],
  }),
)

const cleanupOldRuntimeCaches = async () => {
  const currentCaches = new Set([PAGE_CACHE_NAME, IMAGE_CACHE_NAME])
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter((name) => name.startsWith(`${APP_CACHE_PREFIX}-`) && !currentCaches.has(name))
      .map((name) => caches.delete(name)),
  )
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await cleanupOldRuntimeCaches()
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data?.type === 'SKIP_WAITING') {
    void self.skipWaiting()
  }
})

const normalizeNotificationDeepLink = (deepLink: unknown): string => {
  if (typeof deepLink !== 'string' || !deepLink) return '/'
  if (deepLink.startsWith('/chat-rooms/')) {
    const roomId = deepLink.slice('/chat-rooms/'.length)
    return roomId ? `/chat/${roomId}` : '/'
  }
  return deepLink
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
}

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId,
)

if (!hasFirebaseConfig) {
  console.warn('[sw] Firebase 설정이 없어 백그라운드 알림을 비활성화합니다.')
} else {
  const firebaseApp = initializeApp(firebaseConfig)
  const messaging = getMessaging(firebaseApp)

  onBackgroundMessage(messaging, (payload) => {
    try {
      const title = payload?.notification?.title || '알림'
      const options: NotificationOptions = {
        body: payload?.notification?.body || '',
        icon: '/icons/icon-192x192.png',
        data: payload?.data,
      }
      void self.registration.showNotification(title, options)

      void self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'notifications:refresh' })
        })
      })
    } catch (error) {
      console.error('[sw] 백그라운드 알림 처리 중 오류가 발생했습니다.', error)
    }
  })
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const rawDeepLink = event.notification?.data?.deepLink
  const deepLink = normalizeNotificationDeepLink(rawDeepLink)
  const targetUrl = new URL(deepLink, self.location.origin).toString()

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
      return undefined
    }),
  )
})

export {}
