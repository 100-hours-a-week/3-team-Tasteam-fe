type AppEnv = 'development' | 'staging' | 'production'

const getEnv = (key: string, fallback = '') => {
  const value = import.meta.env[key]
  return value ?? fallback
}

export const APP_ENV = getEnv('VITE_APP_ENV', 'development') as AppEnv

export const APP_URL = getEnv('VITE_APP_URL', 'http://localhost:3000')
export const API_BASE_URL = getEnv('VITE_API_BASE_URL', 'http://localhost:8080')
export const DUMMY_DATA = getEnv('VITE_DUMMY_DATA', 'false') === 'true'
