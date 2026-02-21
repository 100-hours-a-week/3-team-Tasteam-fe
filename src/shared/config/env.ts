type AppEnv = 'development' | 'staging' | 'production'

const getEnv = (key: string, fallback = '') => {
  const value = import.meta.env[key]
  return value ?? fallback
}

export const APP_ENV = getEnv('VITE_APP_ENV', 'development') as AppEnv

export const APP_URL = getEnv('VITE_APP_URL', 'http://localhost:3000')
export const API_BASE_URL = getEnv('VITE_API_BASE_URL', 'http://localhost:8080')
export const DUMMY_DATA = getEnv('VITE_DUMMY_DATA', 'false') === 'true'
export const AUTH_DEBUG = getEnv('VITE_AUTH_DEBUG', 'false') === 'true'
const DEFAULT_LOG_LEVEL: Record<AppEnv, string> = {
  development: 'debug',
  staging: 'info',
  production: 'none',
}

export const LOG_LEVEL = getEnv('VITE_LOG_LEVEL', DEFAULT_LOG_LEVEL[APP_ENV])

export const FIREBASE_API_KEY = getEnv('VITE_FIREBASE_API_KEY')
export const FIREBASE_AUTH_DOMAIN = getEnv('VITE_FIREBASE_AUTH_DOMAIN')
export const FIREBASE_PROJECT_ID = getEnv('VITE_FIREBASE_PROJECT_ID')
export const FIREBASE_STORAGE_BUCKET = getEnv('VITE_FIREBASE_STORAGE_BUCKET')
export const FIREBASE_MESSAGING_SENDER_ID = getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID')
export const FIREBASE_APP_ID = getEnv('VITE_FIREBASE_APP_ID')
export const FIREBASE_MEASUREMENT_ID = getEnv('VITE_FIREBASE_MEASUREMENT_ID')
export const FIREBASE_VAPID_KEY = getEnv('VITE_FIREBASE_VAPID_KEY')
