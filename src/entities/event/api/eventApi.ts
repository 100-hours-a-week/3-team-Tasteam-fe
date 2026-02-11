import { request } from '@/shared/api/request'
import type { EventListResponseDto, EventDetailResponseDto, EventStatus } from '../model/dto'

export type GetEventsParams = {
  page?: number
  size?: number
  status?: EventStatus
}

export const getEvents = (params?: GetEventsParams) =>
  request<EventListResponseDto>({
    method: 'GET',
    url: '/api/v1/events',
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      status: params?.status,
    },
  })

export const getEventDetail = (id: number) =>
  request<EventDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/events/${id}`,
  })
