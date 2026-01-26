import { mockRequest } from '@/shared/api/mockRequest'
import { buildQuery } from '@/shared/api/query'
import type {
  ReviewListResponseDto,
  ReviewDetailResponseDto,
  ReviewCreateRequestDto,
  ReviewCreateResponseDto,
} from '../model/dto'

export const getRestaurantReviews = (
  restaurantId: number,
  params?: { cursor?: string; size?: number },
) =>
  mockRequest<ReviewListResponseDto>({
    method: 'GET',
    url: `/api/v1/restaurants/${restaurantId}/reviews${buildQuery(params ?? {})}`,
  })

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
  mockRequest<ReviewDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/reviews/${reviewId}${buildQuery(params)}`,
  })

export const createReview = (restaurantId: number, payload: ReviewCreateRequestDto) =>
  mockRequest<ReviewCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/restaurants/${restaurantId}/reviews`,
    data: payload,
  })

export const deleteReview = (reviewId: number) =>
  mockRequest<void>({
    method: 'DELETE',
    url: `/api/v1/reviews/${reviewId}`,
  })
