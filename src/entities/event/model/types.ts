import type { EventStatus } from './dto'

export type Event = {
  id: number
  title: string
  content: string
  thumbnailImageUrl: string | null
  startAt: string
  endAt: string
  status: EventStatus
  createdAt: string
  updatedAt: string
}
