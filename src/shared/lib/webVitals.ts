import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'
import { captureWebVital } from './sentry'

export function reportWebVitals() {
  onCLS(({ name, value, rating }) => captureWebVital(name, value, rating))
  onINP(({ name, value, rating }) => captureWebVital(name, value, rating))
  onLCP(({ name, value, rating }) => captureWebVital(name, value, rating))
  onFCP(({ name, value, rating }) => captureWebVital(name, value, rating))
  onTTFB(({ name, value, rating }) => captureWebVital(name, value, rating))
}
