import { APP_ENV } from '@/shared/config/env'
import { logger } from '@/shared/lib/logger'
import { sendUserActivityEvents } from '../api/userActivityIngestApi'
import {
  findMissingRequiredProperties,
  getRequiredPropertyKeys,
  isTrackEventName,
} from './eventCatalog'
import type { ActivityEventItemRequest, TrackEventInput, UserActivityTracker } from './types'
import { ActivityQueue } from './activityQueue'

type ActivityDispatcherOptions = {
  maxBatchSize: number
  flushIntervalMs: number
  enabled: boolean
  debug: boolean
  queue: ActivityQueue
  anonymousId: string
}

const MIN_RETRY_DELAY_MS = 3000
const MAX_RETRY_DELAY_MS = 60000

const BLOCKED_PROPERTY_KEYS = new Set([
  'query',
  'keyword',
  'searchquery',
  'content',
  'reviewtext',
  'address',
  'phonenumber',
  'phone',
  'imageurl',
  'imageurls',
  'thumbnailimageurl',
])

const toJsonSafe = (value: unknown, depth = 0): unknown => {
  if (value == null) return value
  if (typeof value === 'string') return value.length > 200 ? value.slice(0, 200) : value
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (depth >= 2) return undefined

  if (Array.isArray(value)) {
    return value
      .slice(0, 30)
      .map((item) => toJsonSafe(item, depth + 1))
      .filter((item) => item !== undefined)
  }

  if (typeof value === 'object') {
    const normalized: Record<string, unknown> = {}
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      if (BLOCKED_PROPERTY_KEYS.has(key.toLowerCase())) {
        continue
      }
      const safeValue = toJsonSafe(nestedValue, depth + 1)
      if (safeValue === undefined) {
        continue
      }
      normalized[key] = safeValue
    }
    return normalized
  }

  return undefined
}

const sanitizeProperties = (properties: Record<string, unknown>) => {
  const normalized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(properties)) {
    if (BLOCKED_PROPERTY_KEYS.has(key.toLowerCase())) {
      continue
    }
    const safeValue = toJsonSafe(value)
    if (safeValue === undefined) {
      continue
    }
    normalized[key] = safeValue
  }
  return normalized
}

const createEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

export class ActivityDispatcher implements UserActivityTracker {
  private readonly maxBatchSize: number
  private readonly flushIntervalMs: number
  private readonly queue: ActivityQueue
  private readonly anonymousId: string
  private readonly debug: boolean
  private enabled: boolean
  private isFlushing = false
  private retryAttempt = 0
  private retryTimerId: number | null = null
  private intervalId: number | null = null
  private onlineListener: (() => void) | null = null

  constructor(options: ActivityDispatcherOptions) {
    this.maxBatchSize = Math.max(1, options.maxBatchSize)
    this.flushIntervalMs = Math.max(1000, options.flushIntervalMs)
    this.enabled = options.enabled
    this.debug = options.debug
    this.queue = options.queue
    this.anonymousId = options.anonymousId
  }

  start() {
    this.stop()
    this.intervalId = window.setInterval(() => {
      void this.flush()
    }, this.flushIntervalMs)

    const handleOnline = () => {
      void this.flush()
    }
    window.addEventListener('online', handleOnline)
    this.onlineListener = () => window.removeEventListener('online', handleOnline)
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (this.retryTimerId !== null) {
      window.clearTimeout(this.retryTimerId)
      this.retryTimerId = null
    }
    this.onlineListener?.()
    this.onlineListener = null
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (enabled) {
      void this.flush()
    }
  }

  track(input: TrackEventInput) {
    if (!this.enabled) return
    if (!isTrackEventName(input.eventName)) {
      logger.warn('[activity] 허용되지 않은 이벤트명을 무시합니다.', {
        eventName: input.eventName,
      })
      return
    }

    const normalizedProperties = sanitizeProperties(input.properties)
    const missingKeys = findMissingRequiredProperties(input.eventName, normalizedProperties)
    if (missingKeys.length > 0) {
      logger.warn('[activity] 필수 속성 누락 이벤트를 무시합니다.', {
        eventName: input.eventName,
        required: getRequiredPropertyKeys(input.eventName),
        missing: missingKeys,
      })
      return
    }

    const event: ActivityEventItemRequest = {
      eventId: createEventId(),
      eventName: input.eventName,
      eventVersion: 'v1',
      occurredAt: input.occurredAt ?? new Date().toISOString(),
      properties: {
        source: 'CLIENT',
        platform: 'WEB',
        appEnv: APP_ENV,
        ...normalizedProperties,
      },
    }

    this.queue.enqueue(event)

    if (this.debug) {
      logger.debug('[activity] 이벤트 큐 적재', {
        eventName: event.eventName,
        queueSize: this.queue.size(),
      })
    }

    if (this.queue.size() >= this.maxBatchSize) {
      void this.flush()
    }
  }

  async flush(options?: { keepalive?: boolean }) {
    if (!this.enabled) return
    if (this.isFlushing) return
    if (this.queue.size() === 0) return

    this.isFlushing = true
    try {
      while (this.queue.size() > 0) {
        const batch = this.queue.dequeueBatch(this.maxBatchSize)
        if (batch.length === 0) break

        const result = await sendUserActivityEvents(
          {
            anonymousId: this.anonymousId,
            events: batch,
          },
          { keepalive: options?.keepalive ?? false },
        )

        if (result.ok) {
          this.retryAttempt = 0
          if (this.debug) {
            logger.debug('[activity] 배치 전송 성공', { size: batch.length })
          }
          continue
        }

        if (result.retryable) {
          this.queue.requeueFront(batch)
          this.scheduleRetry()
          break
        }

        logger.warn('[activity] 재시도 불가 배치를 폐기합니다.', {
          status: result.status,
          code: result.code,
          droppedCount: batch.length,
        })
      }
    } finally {
      this.isFlushing = false
    }
  }

  private scheduleRetry() {
    if (this.retryTimerId !== null) {
      return
    }

    this.retryAttempt += 1
    const exponentialDelay = Math.min(
      MIN_RETRY_DELAY_MS * Math.pow(2, this.retryAttempt - 1),
      MAX_RETRY_DELAY_MS,
    )
    const jitter = Math.floor(Math.random() * 1000)
    const delay = Math.min(exponentialDelay + jitter, MAX_RETRY_DELAY_MS)

    this.retryTimerId = window.setTimeout(() => {
      this.retryTimerId = null
      void this.flush()
    }, delay)

    logger.warn('[activity] 재시도 예약', {
      retryAttempt: this.retryAttempt,
      delayMs: delay,
      queuedCount: this.queue.size(),
    })
  }
}
