importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js')

const normalizeDeepLink = (deepLink) => {
  if (typeof deepLink !== 'string' || !deepLink) return '/'
  if (deepLink.startsWith('/chat-rooms/')) {
    const roomId = deepLink.slice('/chat-rooms/'.length)
    return roomId ? `/chat/${roomId}` : '/'
  }
  return deepLink
}

try {
  const params = new URLSearchParams(self.location.search)
  const firebaseConfig = {
    apiKey: params.get('apiKey'),
    authDomain: params.get('authDomain'),
    projectId: params.get('projectId'),
    storageBucket: params.get('storageBucket'),
    messagingSenderId: params.get('messagingSenderId'),
    appId: params.get('appId'),
    measurementId: params.get('measurementId') || undefined,
  }

  const hasConfig = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId,
  )

  if (!hasConfig) {
    console.warn('[firebase-sw] Missing Firebase configuration')
  } else {
    firebase.initializeApp(firebaseConfig)
    const messaging = firebase.messaging()

    messaging.onBackgroundMessage((payload) => {
      try {
        const title = payload?.notification?.title || '알림'
        const options = {
          body: payload?.notification?.body || '',
          icon: '/icons/icon-192x192.png',
          data: payload?.data,
        }
        self.registration.showNotification(title, options)

        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'notifications:refresh' })
          })
        })
      } catch (error) {
        console.error('[firebase-sw] Failed to show notification', error)
      }
    })
  }
} catch (error) {
  console.error('[firebase-sw] Service Worker initialization failed', error)
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const rawDeepLink = event.notification?.data?.deepLink
  const deepLink = normalizeDeepLink(rawDeepLink)
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
