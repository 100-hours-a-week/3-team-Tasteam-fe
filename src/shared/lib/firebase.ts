import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging'
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '@/shared/config/env'

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

export const initFirebaseApp = (): FirebaseApp | null => {
  if (!hasFirebaseConfig()) return null
  if (getApps().length > 0) return getApp()
  return initializeApp(firebaseConfig)
}

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (!hasFirebaseConfig()) return null
  if (!(await isSupported())) return null
  const app = initFirebaseApp()
  if (!app) return null
  return getMessaging(app)
}

export const registerFirebaseMessagingServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null
  if (!hasFirebaseConfig()) return null

  const params = new URLSearchParams({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID ?? '',
  })

  return navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params.toString()}`)
}
