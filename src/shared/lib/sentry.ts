import { APP_ENV, API_BASE_URL, SENTRY_DSN, SENTRY_ENABLED } from '@/shared/config/env'
import { logger } from '@/shared/lib/logger'

type SentryUser = { id?: string | number; username?: string } | null

type SentryModule = {
  init: (options: Record<string, unknown>) => void
  captureException: (error: unknown) => void
  captureEvent: (event: Record<string, unknown>) => void
  setUser: (user: SentryUser) => void
  browserTracingIntegration: () => unknown
  replayIntegration: () => unknown
}

const TRACES_SAMPLE_RATE: Record<string, number> = {
  production: 0.1,
  staging: 0.5,
  development: 1.0,
}

let sentryModule: SentryModule | null = null
let initialized = false
const importModule = new Function('modulePath', 'return import(modulePath)') as (
  modulePath: string,
) => Promise<unknown>

export function initSentry() {
  if (!SENTRY_DSN || !SENTRY_ENABLED || initialized) return
  initialized = true

  void importModule('@sentry/react')
    .then((mod) => {
      const sentry = mod as unknown as SentryModule
      sentry.init({
        dsn: SENTRY_DSN,
        environment: APP_ENV,
        release: __APP_VERSION__,
        sendDefaultPii: true,
        tracesSampleRate: TRACES_SAMPLE_RATE[APP_ENV] ?? 1.0,
        integrations: [sentry.browserTracingIntegration(), sentry.replayIntegration()],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        tracePropagationTargets: ['localhost', API_BASE_URL],
        enableLogs: true,
      })
      sentryModule = sentry
    })
    .catch((error) => {
      initialized = false
      logger.warn('[sentry] failed to load @sentry/react; continuing without Sentry', error)
    })
}

export const captureWebVital = (name: string, value: number, rating: string) => {
  sentryModule?.captureEvent({
    type: 'transaction',
    event_id: crypto.randomUUID(),
    transaction: `web-vitals/${name}`,
    measurements: { [name.toLowerCase()]: { value, unit: 'millisecond' } },
    tags: { rating },
    level: 'info',
  })
}

export const captureException = (error: unknown) => {
  if (sentryModule) {
    sentryModule.captureException(error)
  }
}

export const Sentry = {
  setUser(user: SentryUser) {
    if (sentryModule) {
      sentryModule.setUser(user)
    }
  },
}
