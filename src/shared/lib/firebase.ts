import type { FirebaseApp } from 'firebase/app'
import type { Messaging } from 'firebase/messaging'
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '@/shared/config/env'
import { logger } from './logger'

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
}

const hasFirebaseConfig = () =>
  Boolean(
    FIREBASE_API_KEY &&
    FIREBASE_AUTH_DOMAIN &&
    FIREBASE_PROJECT_ID &&
    FIREBASE_STORAGE_BUCKET &&
    FIREBASE_MESSAGING_SENDER_ID &&
    FIREBASE_APP_ID,
  )

let firebaseAppModulePromise: Promise<typeof import('firebase/app')> | null = null
let firebaseMessagingModulePromise: Promise<typeof import('firebase/messaging')> | null = null

const loadFirebaseAppModule = () => {
  if (!firebaseAppModulePromise) {
    firebaseAppModulePromise = import('firebase/app')
  }

  return firebaseAppModulePromise
}

const loadFirebaseMessagingModule = () => {
  if (!firebaseMessagingModulePromise) {
    firebaseMessagingModulePromise = import('firebase/messaging')
  }

  return firebaseMessagingModulePromise
}

export const initFirebaseApp = async (): Promise<FirebaseApp | null> => {
  try {
    if (!hasFirebaseConfig()) {
      logger.debug('[firebase] Config unavailable')
      return null
    }

    const { getApp, getApps, initializeApp } = await loadFirebaseAppModule()

    if (getApps().length > 0) return getApp()
    return initializeApp(firebaseConfig)
  } catch (error) {
    logger.error('[firebase] Failed to initialize Firebase app', error)
    return null
  }
}

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  try {
    if (!hasFirebaseConfig()) {
      logger.debug('[firebase] Config unavailable for messaging')
      return null
    }

    const { getMessaging, isSupported } = await loadFirebaseMessagingModule()
    const supported = await isSupported()
    if (!supported) {
      logger.debug('[firebase] Messaging not supported in this environment')
      return null
    }

    const app = await initFirebaseApp()
    if (!app) {
      logger.warn('[firebase] Firebase app initialization failed')
      return null
    }

    return getMessaging(app)
  } catch (error) {
    logger.error('[firebase] Failed to get Firebase messaging', error)
    return null
  }
}

const SERVICE_WORKER_READY_TIMEOUT_MS = 3000

const waitForServiceWorkerReady = async (
  timeoutMs = SERVICE_WORKER_READY_TIMEOUT_MS,
): Promise<ServiceWorkerRegistration | null> => {
  const readyPromise = navigator.serviceWorker.ready
  const timeoutPromise = new Promise<null>((resolve) => {
    window.setTimeout(() => resolve(null), timeoutMs)
  })

  const readyRegistration = await Promise.race([readyPromise, timeoutPromise])
  return readyRegistration ?? null
}

export const getAppServiceWorkerRegistration = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      logger.debug('[firebase] Service Worker not supported')
      return null
    }

    if (!hasFirebaseConfig()) {
      logger.debug('[firebase] Config unavailable for service worker')
      return null
    }

    const existingRegistration = await navigator.serviceWorker.getRegistration()
    if (existingRegistration) {
      return existingRegistration
    }

    const readyRegistration = await waitForServiceWorkerReady()
    if (readyRegistration) {
      return readyRegistration
    }

    logger.warn('[firebase] 앱 서비스 워커를 찾지 못했습니다')
    return null
  } catch (error) {
    logger.error('[firebase] 앱 서비스 워커 조회에 실패했습니다', error)
    return null
  }
}
