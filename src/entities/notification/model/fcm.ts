import { getToken } from 'firebase/messaging'
import { FIREBASE_VAPID_KEY } from '@/shared/config/env'
import { logger } from '@/shared/lib/logger'
import { getOrCreateDeviceId } from '@/shared/lib/deviceId'
import { getFirebaseMessaging, registerFirebaseMessagingServiceWorker } from '@/shared/lib/firebase'
import { registerPushNotificationTarget } from '../api/notificationApi'

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

export const syncFcmToken = async () => {
  if (syncInFlight) {
    await syncInFlight
    return
  }

  syncInFlight = (async () => {
    if (!canUseNotifications()) {
      logger.debug('[fcm] Notification API unavailable')
      return
    }
    if (!FIREBASE_VAPID_KEY) {
      logger.debug('[fcm] Missing VAPID key')
      return
    }

    if (Notification.permission === 'denied') {
      logger.debug('[fcm] Notification permission denied')
      return
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        logger.debug('[fcm] Notification permission not granted')
        return
      }
    }

    const registration = await registerFirebaseMessagingServiceWorker()
    if (!registration) {
      logger.debug('[fcm] Service worker registration failed')
      return
    }

    const messaging = await getFirebaseMessaging()
    if (!messaging) {
      logger.debug('[fcm] Messaging unsupported or not initialized')
      return
    }

    const token = await getToken(messaging, {
      vapidKey: FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    })

    if (!token) {
      logger.debug('[fcm] Token not issued')
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
      logger.debug('[fcm] Device id unavailable')
      return
    }

    await registerPushNotificationTarget({ deviceId, fcmToken: token })
    setStoredToken(token)
    setLastSync(Date.now())
    logger.debug('[fcm] Token registered')
  })()

  try {
    await syncInFlight
  } finally {
    syncInFlight = null
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

  return () => {
    window.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('focus', scheduleSync)
    window.removeEventListener('online', scheduleSync)
    window.clearInterval(intervalId)
  }
}
