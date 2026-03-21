import { captureWebVital } from './sentry'

type RequestIdleCallbackHandle = number
type RequestIdleCallbackOptions = {
  timeout?: number
}
type RequestIdleCallback = (
  callback: IdleRequestCallback,
  options?: RequestIdleCallbackOptions,
) => RequestIdleCallbackHandle

let hasScheduledWebVitals = false

const loadWebVitals = async () => {
  const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals')

  onCLS(({ name, value, rating }) => captureWebVital(name, value, rating))
  onINP(({ name, value, rating }) => captureWebVital(name, value, rating))
  onLCP(({ name, value, rating }) => captureWebVital(name, value, rating))
  onFCP(({ name, value, rating }) => captureWebVital(name, value, rating))
  onTTFB(({ name, value, rating }) => captureWebVital(name, value, rating))
}

export function reportWebVitals() {
  if (hasScheduledWebVitals || typeof window === 'undefined') return
  hasScheduledWebVitals = true
  const browserWindow = window as Window &
    typeof globalThis & {
      requestIdleCallback?: RequestIdleCallback
    }

  const start = () => {
    void loadWebVitals()
  }

  if (browserWindow.requestIdleCallback) {
    const requestIdleCallback = browserWindow.requestIdleCallback
    requestIdleCallback(() => start(), { timeout: 2000 })
    return
  }

  if (document.readyState === 'complete') {
    browserWindow.setTimeout(start, 0)
    return
  }

  browserWindow.addEventListener('load', () => browserWindow.setTimeout(start, 0), { once: true })
}
