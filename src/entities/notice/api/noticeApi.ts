import { request } from '@/shared/api/request'
import type { NoticeListResponseDto, NoticeDetailResponseDto } from '../model/dto'

export type GetNoticesParams = {
  page?: number
  size?: number
}

export const getNotices = (params?: GetNoticesParams) =>
  request<NoticeListResponseDto>({
    method: 'GET',
    url: '/api/v1/notices',
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
    },
  })

export const getNoticeDetail = (id: number) =>
  request<NoticeDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/notices/${id}`,
  })
