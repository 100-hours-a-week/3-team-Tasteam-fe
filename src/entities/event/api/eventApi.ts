import { request } from '@/shared/api/request'
import type { OffsetPageResponse } from '@/shared/types/pagination'
import type { SuccessResponse } from '@/shared/types/api'
import type {
  EventDto,
  EventListResponseDto,
  EventDetailResponseDto,
  EventStatus,
} from '../model/dto'

export type GetEventsParams = {
  page?: number
  size?: number
  status?: EventStatus
}

type PromotionStatus = 'ONGOING' | 'ENDED' | 'UPCOMING'

type PromotionSummaryResponse = {
  id: number
  title: string
  summary: string
  landingUrl: string
  bannerImageUrl: string | null
  promotionStartAt: string
  promotionEndAt: string
  promotionStatus: PromotionStatus
  displayStartAt: string
  displayEndAt: string
}

type PromotionDetailResponse = {
  id: number
  title: string
  content: string
  landingUrl: string
  promotionStartAt: string
  promotionEndAt: string
  promotionStatus: PromotionStatus
  displayStartAt: string
  displayEndAt: string
  bannerImageUrl: string | null
  detailImageUrls: string[]
}

type PromotionListResponseDto = SuccessResponse<OffsetPageResponse<PromotionSummaryResponse>>
type PromotionDetailResponseDto = SuccessResponse<PromotionDetailResponse>

const toEventStatus = (status: PromotionStatus): EventStatus => status

const toEventSummary = (promotion: PromotionSummaryResponse): EventDto => ({
  id: promotion.id,
  title: promotion.title,
  content: promotion.summary,
  thumbnailImageUrl: promotion.bannerImageUrl ?? null,
  startAt: promotion.promotionStartAt,
  endAt: promotion.promotionEndAt,
  status: toEventStatus(promotion.promotionStatus),
  createdAt: promotion.displayStartAt ?? promotion.promotionStartAt,
  updatedAt: promotion.displayEndAt ?? promotion.promotionEndAt,
})

const toEventDetail = (promotion: PromotionDetailResponse): EventDto => ({
  id: promotion.id,
  title: promotion.title,
  content: promotion.content,
  thumbnailImageUrl: promotion.bannerImageUrl ?? null,
  startAt: promotion.promotionStartAt,
  endAt: promotion.promotionEndAt,
  status: toEventStatus(promotion.promotionStatus),
  createdAt: promotion.displayStartAt ?? promotion.promotionStartAt,
  updatedAt: promotion.displayEndAt ?? promotion.promotionEndAt,
  detailImageUrls: promotion.detailImageUrls,
})

const toEventListResponse = (response: PromotionListResponseDto): EventListResponseDto => {
  const pagination = response.data?.pagination
  const events = response.data?.items?.map(toEventSummary) ?? []
  const hasNext = pagination ? pagination.page + 1 < pagination.totalPages : false

  return {
    success: response.success,
    data: {
      events,
      totalCount: pagination?.totalElements ?? events.length,
      hasNext,
    },
  }
}

export const getEvents = (params?: GetEventsParams) =>
  request<PromotionListResponseDto>({
    method: 'GET',
    url: '/api/v1/promotions',
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      promotionStatus: params?.status,
    },
  }).then(toEventListResponse)

export const getEventDetail = (id: number) =>
  request<PromotionDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/promotions/${id}`,
  }).then((response) => ({
    success: response.success,
    data: toEventDetail(response.data),
  }))
