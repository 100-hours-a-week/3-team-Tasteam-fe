import { getToken, onMessage } from 'firebase/messaging'
import { toast } from 'sonner'
import { FIREBASE_VAPID_KEY } from '@/shared/config/env'
import { logger } from '@/shared/lib/logger'
import { getOrCreateDeviceId } from '@/shared/lib/deviceId'
import { getFirebaseMessaging, registerFirebaseMessagingServiceWorker } from '@/shared/lib/firebase'
import { registerPushNotificationTarget } from '../api/notificationApi'
import { normalizeNotificationDeepLink } from './deepLink'

const FCM_TOKEN_STORAGE_KEY = 'fcm:token:v1'
const FCM_LAST_SYNC_KEY = 'fcm:token:last-sync:v1'
const FCM_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000
let syncInFlight: Promise<void> | null = null

const getStoredToken = () => {
  try {
    return localStorage.getItem(FCM_TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

const setStoredToken = (token: string) => {
  try {
    localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token)
  } catch {
    // ignore storage errors
  }
}

const setLastSync = (time: number) => {
  try {
    localStorage.setItem(FCM_LAST_SYNC_KEY, String(time))
  } catch {
    // ignore storage errors
  }
}

const getLastSync = () => {
  try {
    const value = localStorage.getItem(FCM_LAST_SYNC_KEY)
    return value ? Number(value) : null
  } catch {
    return null
  }
}

const canUseNotifications = () =>
  typeof window !== 'undefined' && typeof Notification !== 'undefined'

const isInsideChatRoom = () => {
  if (typeof window === 'undefined') return false
  return /^\/chat\/[^/]+$/.test(window.location.pathname)
}

export const syncFcmToken = async () => {
  if (syncInFlight) {
    await syncInFlight
    return
  }

  syncInFlight = (async () => {
    try {
      if (!canUseNotifications()) {
        logger.debug('[fcm] Notification API unavailable')
        return
      }
      if (!FIREBASE_VAPID_KEY) {
        logger.warn('[fcm] Missing VAPID key')
        return
      }

      if (Notification.permission === 'denied') {
        logger.debug('[fcm] Notification permission denied')
        return
      }

      if (Notification.permission === 'default') {
        try {
          const permission = await Notification.requestPermission()
          if (permission !== 'granted') {
            logger.debug('[fcm] Notification permission not granted')
            return
          }
        } catch (error) {
          logger.error('[fcm] Failed to request notification permission', error)
          return
        }
      }

      let registration
      try {
        registration = await registerFirebaseMessagingServiceWorker()
        if (!registration) {
          logger.warn('[fcm] Service worker registration failed')
          return
        }
      } catch (error) {
        logger.error('[fcm] Service worker registration error', error)
        return
      }

      let messaging
      try {
        messaging = await getFirebaseMessaging()
        if (!messaging) {
          logger.warn('[fcm] Messaging unsupported or not initialized')
          return
        }
      } catch (error) {
        logger.error('[fcm] Failed to initialize Firebase messaging', error)
        return
      }

      let token
      try {
        token = await getToken(messaging, {
          vapidKey: FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        })

        if (!token) {
          logger.warn('[fcm] Token not issued')
          return
        }
      } catch (error) {
        logger.error('[fcm] Failed to get FCM token', error)
        return
      }

      const stored = getStoredToken()
      if (stored === token) {
        logger.debug('[fcm] Token unchanged, skip register')
        setLastSync(Date.now())
        return
      }

      const deviceId = getOrCreateDeviceId()
      if (!deviceId) {
        logger.warn('[fcm] Device id unavailable')
        return
      }

      try {
        await registerPushNotificationTarget({ deviceId, fcmToken: token })
        setStoredToken(token)
        setLastSync(Date.now())
        logger.debug('[fcm] Token registered')
      } catch (error) {
        logger.error('[fcm] Failed to register token with server', error)
        throw error
      }
    } catch (error) {
      logger.error('[fcm] Unexpected error during token sync', error)
    }
  })()

  try {
    await syncInFlight
  } finally {
    syncInFlight = null
  }
}

const setupForegroundMessageListener = async () => {
  try {
    const messaging = await getFirebaseMessaging()
    if (!messaging) {
      logger.debug('[fcm] Messaging unavailable for foreground listener')
      return
    }

    onMessage(messaging, (payload) => {
      try {
        logger.debug('[fcm] Foreground message received', payload)

        const title = payload.notification?.title || '알림'
        const body = payload.notification?.body || ''
        const deepLink = payload.data?.deepLink
          ? normalizeNotificationDeepLink(payload.data.deepLink)
          : null

        if (isInsideChatRoom()) return

        toast.message(title, {
          description: body,
          duration: 2000,
          position: 'top-center',
          ...(deepLink
            ? {
                action: {
                  label: '보기',
                  onClick: () => window.location.assign(deepLink),
                },
              }
            : {}),
        })
      } catch (error) {
        logger.error('[fcm] Failed to handle foreground message', error)
      }
    })

    logger.debug('[fcm] Foreground message listener setup complete')
  } catch (error) {
    logger.error('[fcm] Failed to setup foreground message listener', error)
  }
}

export const startFcmTokenSync = () => {
  const shouldSync = () => {
    const last = getLastSync()
    return !last || Date.now() - last > FCM_SYNC_INTERVAL_MS
  }

  const scheduleSync = () => {
    if (shouldSync()) {
      void syncFcmToken()
    }
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      scheduleSync()
    }
  }

  window.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('focus', scheduleSync)
  window.addEventListener('online', scheduleSync)

  const intervalId = window.setInterval(scheduleSync, FCM_SYNC_INTERVAL_MS)

  scheduleSync()
  void setupForegroundMessageListener()

  return () => {
    window.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('focus', scheduleSync)
    window.removeEventListener('online', scheduleSync)
    window.clearInterval(intervalId)
  }
}
