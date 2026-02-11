export type EventStatus = 'ONGOING' | 'ENDED' | 'UPCOMING'

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
