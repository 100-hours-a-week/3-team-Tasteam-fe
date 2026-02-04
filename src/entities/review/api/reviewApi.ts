import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  ReviewListResponseDto,
  ReviewListItemDto,
  ReviewDetailResponseDto,
  ReviewCreateRequestDto,
  ReviewCreateResponseDto,
  ReviewKeywordItemDto,
  ReviewKeywordListResponseDto,
} from '../model/dto'

type BackendReviewListItem = {
  id: number
  author?: { nickname?: string | null } | null
  contentPreview?: string | null
  content?: string | null
  isRecommended?: boolean | null
  keywords?: string[] | null
  thumbnailImage?: { id: number | string; url: string } | null
  thumbnailImages?: Array<{ id: number | string; url: string }> | null
  images?: Array<{ id: number | string; url: string }> | null
  thumbnailImageUrl?: string | null
  imageUrl?: string | null
  createdAt?: string | null
}

type BackendReviewListPayload = {
  items?: BackendReviewListItem[]
  pagination?: ReviewListResponseDto['pagination']
}

const EMPTY_REVIEW_LIST: ReviewListResponseDto = {
  items: [],
  pagination: { nextCursor: null, size: 0, hasNext: false },
}

const toThumbnailImage = (item: BackendReviewListItem): ReviewListItemDto['thumbnailImage'] => {
  const fromThumbnailImage = item.thumbnailImage
  if (fromThumbnailImage?.url) {
    return { id: String(fromThumbnailImage.id), url: fromThumbnailImage.url }
  }

  const fromThumbnailImages = item.thumbnailImages?.[0]
  if (fromThumbnailImages?.url) {
    return { id: String(fromThumbnailImages.id), url: fromThumbnailImages.url }
  }

  const fromImages = item.images?.[0]
  if (fromImages?.url) {
    return { id: String(fromImages.id), url: fromImages.url }
  }

  if (item.thumbnailImageUrl) {
    return { id: item.thumbnailImageUrl, url: item.thumbnailImageUrl }
  }

  if (item.imageUrl) {
    return { id: item.imageUrl, url: item.imageUrl }
  }

  return null
}

const normalizeReviewListResponse = (
  payload?: BackendReviewListPayload | null,
): ReviewListResponseDto => {
  if (!payload) return EMPTY_REVIEW_LIST

  const items = (payload.items ?? []).map<ReviewListItemDto>((item) => ({
    id: item.id,
    author: { nickname: item.author?.nickname ?? '알 수 없음' },
    contentPreview: item.contentPreview ?? item.content ?? '',
    isRecommended: Boolean(item.isRecommended),
    keywords: item.keywords ?? [],
    thumbnailImage: toThumbnailImage(item),
    createdAt: item.createdAt ?? new Date().toISOString(),
  }))

  return {
    items,
    pagination: payload.pagination ?? EMPTY_REVIEW_LIST.pagination,
  }
}

export const getRestaurantReviews = (
  restaurantId: number,
  params?: { cursor?: string; size?: number },
) =>
  request<{ data?: BackendReviewListPayload } | BackendReviewListPayload>({
    method: 'GET',
    url: `/api/v1/restaurants/${restaurantId}/reviews${buildQuery(params ?? {})}`,
  }).then((res) => {
    const payload = 'data' in res ? res.data : res
    return normalizeReviewListResponse(payload)
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
