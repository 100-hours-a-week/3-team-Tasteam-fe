import { request } from '@/shared/api/request'
import type { SuccessResponse } from '@/shared/types/api'
import type { OffsetPageResponse } from '@/shared/types/pagination'
import type { NoticeDto, NoticeListResponseDto } from '../model/dto'

export type GetNoticesParams = {
  page?: number
  size?: number
}

type AnnouncementListResponse = {
  id: number
  title: string
  createdAt: string
}

type AnnouncementDetailResponse = {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

type AnnouncementListResponseDto = SuccessResponse<OffsetPageResponse<AnnouncementListResponse>>
type AnnouncementDetailResponseDto = SuccessResponse<AnnouncementDetailResponse>

const toNoticeSummary = (announcement: AnnouncementListResponse): NoticeDto => ({
  id: announcement.id,
  title: announcement.title,
  content: '',
  createdAt: announcement.createdAt,
  updatedAt: announcement.createdAt,
})

const toNoticeDetail = (announcement: AnnouncementDetailResponse): NoticeDto => ({
  id: announcement.id,
  title: announcement.title,
  content: announcement.content,
  createdAt: announcement.createdAt,
  updatedAt: announcement.updatedAt,
})

const toNoticeListResponse = (response: AnnouncementListResponseDto): NoticeListResponseDto => {
  const pagination = response.data?.pagination
  const notices = response.data?.items?.map(toNoticeSummary) ?? []
  const hasNext = pagination ? pagination.page + 1 < pagination.totalPages : false

  return {
    success: response.success,
    data: {
      notices,
      totalCount: pagination?.totalElements ?? notices.length,
      hasNext,
    },
  }
}

export const getNotices = (params?: GetNoticesParams) =>
  request<AnnouncementListResponseDto>({
    method: 'GET',
    url: '/api/v1/announcements',
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
    },
  }).then(toNoticeListResponse)

export const getNoticeDetail = (id: number) =>
  request<AnnouncementDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/announcements/${id}`,
  }).then((response) => ({
    success: response.success,
    data: toNoticeDetail(response.data),
  }))
