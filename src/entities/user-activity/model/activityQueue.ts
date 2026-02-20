import type { ActivityEventItemRequest } from './types'

const ACTIVITY_QUEUE_STORAGE_KEY = 'activity:queue:v1'

const parseStoredItems = (raw: string | null): ActivityEventItemRequest[] => {
  if (!raw) {
    return []
  }
  try {
    const parsed = JSON.parse(raw) as ActivityEventItemRequest[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item === 'object')
  } catch {
    return []
  }
}

export class ActivityQueue {
  private readonly maxSize: number
  private items: ActivityEventItemRequest[]

  constructor(maxSize: number) {
    this.maxSize = Math.max(1, maxSize)
    this.items = this.load()
    this.trimToMaxSize()
    this.persist()
  }

  size() {
    return this.items.length
  }

  enqueue(item: ActivityEventItemRequest) {
    this.items.push(item)
    this.trimToMaxSize()
    this.persist()
  }

  dequeueBatch(batchSize: number) {
    if (batchSize <= 0 || this.items.length === 0) {
      return []
    }
    const chunk = this.items.splice(0, batchSize)
    this.persist()
    return chunk
  }

  requeueFront(items: ActivityEventItemRequest[]) {
    if (items.length === 0) return
    this.items = [...items, ...this.items]
    this.trimToMaxSize()
    this.persist()
  }

  private trimToMaxSize() {
    if (this.items.length <= this.maxSize) {
      return
    }
    this.items = this.items.slice(this.items.length - this.maxSize)
  }

  private load() {
    try {
      return parseStoredItems(localStorage.getItem(ACTIVITY_QUEUE_STORAGE_KEY))
    } catch {
      return []
    }
  }

  private persist() {
    try {
      localStorage.setItem(ACTIVITY_QUEUE_STORAGE_KEY, JSON.stringify(this.items))
    } catch {
      // no-op
    }
  }
}
