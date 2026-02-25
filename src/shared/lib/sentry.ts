import * as Sentry from '@sentry/react'
import { browserTracingIntegration, replayIntegration } from '@sentry/react'
import { APP_ENV, API_BASE_URL, SENTRY_DSN, SENTRY_ENABLED } from '@/shared/config/env'

const TRACES_SAMPLE_RATE: Record<string, number> = {
  production: 0.1,
  staging: 0.5,
  development: 1.0,
}

export function initSentry() {
  if (!SENTRY_DSN || !SENTRY_ENABLED) return

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    release: __APP_VERSION__,
    sendDefaultPii: true,
    tracesSampleRate: TRACES_SAMPLE_RATE[APP_ENV] ?? 1.0,
    integrations: [browserTracingIntegration(), replayIntegration()],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    tracePropagationTargets: ['localhost', API_BASE_URL],
    enableLogs: true,
  })
}

export const captureException = Sentry.captureException
export { Sentry }
