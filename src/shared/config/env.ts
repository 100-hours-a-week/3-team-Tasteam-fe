type AppEnv = 'development' | 'staging' | 'production'

const getEnv = (key: string, fallback = '') => {
  const value = import.meta.env[key]
  return value ?? fallback
}

const getBooleanEnv = (key: string, fallback: boolean) => {
  const value = getEnv(key, String(fallback))
  return value === 'true'
}

const getNumberEnv = (key: string, fallback: number) => {
  const value = Number(getEnv(key, String(fallback)))
  return Number.isFinite(value) ? value : fallback
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

export const ACTIVITY_ENABLED = getBooleanEnv('VITE_ACTIVITY_ENABLED', true)
export const ACTIVITY_FLUSH_INTERVAL_MS = getNumberEnv('VITE_ACTIVITY_FLUSH_INTERVAL_MS', 10_000)
export const ACTIVITY_MAX_BATCH_SIZE = getNumberEnv('VITE_ACTIVITY_MAX_BATCH_SIZE', 20)
export const ACTIVITY_MAX_QUEUE_SIZE = getNumberEnv('VITE_ACTIVITY_MAX_QUEUE_SIZE', 500)
export const ACTIVITY_DEBUG = getBooleanEnv('VITE_ACTIVITY_DEBUG', false)

export const SENTRY_DSN = getEnv('VITE_SENTRY_DSN')
export const SENTRY_ENABLED = getBooleanEnv('VITE_SENTRY_ENABLED', APP_ENV !== 'development')
