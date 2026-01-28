import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  ReviewListResponseDto,
  ReviewDetailResponseDto,
  ReviewCreateRequestDto,
  ReviewCreateResponseDto,
  ReviewKeywordItemDto,
  ReviewKeywordListResponseDto,
} from '../model/dto'

export const getRestaurantReviews = (
  restaurantId: number,
  params?: { cursor?: string; size?: number },
) =>
  request<{ data?: ReviewListResponseDto }>({
    method: 'GET',
    url: `/api/v1/restaurants/${restaurantId}/reviews${buildQuery(params ?? {})}`,
  }).then(
    (res) => res.data ?? { items: [], pagination: { nextCursor: null, size: 0, hasNext: false } },
  )

export const getReview = (
  reviewId: number,
  params: {
    latitude: number
    longitude: number
    cursor?: string
    size?: number
    category?: string
  },
) =>
  request<ReviewDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/reviews/${reviewId}${buildQuery(params)}`,
  })

export const createReview = (restaurantId: number, payload: ReviewCreateRequestDto) =>
  request<ReviewCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/restaurants/${restaurantId}/reviews`,
    data: payload,
  })

export const deleteReview = (reviewId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/reviews/${reviewId}`,
  })

export const getReviewKeywords = async (): Promise<ReviewKeywordItemDto[]> => {
  const res = await request<ReviewKeywordListResponseDto>({
    method: 'GET',
    url: '/api/v1/reviews/keywords',
  })
  return res.data
}
