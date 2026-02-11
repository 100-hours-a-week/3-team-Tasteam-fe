importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js')

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
      } catch (error) {
        console.error('[firebase-sw] Failed to show notification', error)
      }
    })
  }
} catch (error) {
  console.error('[firebase-sw] Service Worker initialization failed', error)
}
