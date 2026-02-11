import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'

export type EventStatus = 'ONGOING' | 'ENDED' | 'UPCOMING'

export type EventDto = {
  id: number
  title: string
  content: string
  thumbnailImageUrl: string | null
  startAt: IsoDateTimeString
  endAt: IsoDateTimeString
  status: EventStatus
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}

export type EventListResponseDto = SuccessResponse<{
  events: EventDto[]
  totalCount: number
  hasNext: boolean
}>

export type EventDetailResponseDto = SuccessResponse<EventDto>
