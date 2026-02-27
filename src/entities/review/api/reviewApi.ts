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
  groupId?: number | null
  subgroupId?: number | null
  groupName?: string | null
  subgroupName?: string | null
  author?: {
    id?: number | null
    nickname?: string | null
    profileImageUrl?: string | null
    profileImage?: { url?: string | null } | null
  } | null
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
  restaurantId?: number | null
  restaurantName?: string | null
  groupLogoImageUrl?: string | null
  groupAddress?: string | null
  restaurantImageUrl?: string | null
  restaurantAddress?: string | null
  authorProfileImageUrl?: string | null
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
    groupId: item.groupId ?? undefined,
    subgroupId: item.subgroupId ?? undefined,
    groupName: item.groupName ?? undefined,
    subgroupName: item.subgroupName ?? undefined,
    author: {
      id: item.author?.id ?? item.id,
      nickname: item.author?.nickname ?? '알 수 없음',
      profileImageUrl:
        item.author?.profileImageUrl ??
        item.author?.profileImage?.url ??
        item.authorProfileImageUrl ??
        undefined,
    },
    contentPreview: item.contentPreview ?? item.content ?? '',
    isRecommended: Boolean(item.isRecommended),
    keywords: item.keywords ?? [],
    thumbnailImages:
      item.thumbnailImages?.map((image) => ({ id: String(image.id), url: image.url })) ??
      item.images?.map((image) => ({ id: String(image.id), url: image.url })) ??
      (item.thumbnailImage
        ? [{ id: String(item.thumbnailImage.id), url: item.thumbnailImage.url }]
        : item.thumbnailImageUrl
          ? [{ id: item.thumbnailImageUrl, url: item.thumbnailImageUrl }]
          : item.imageUrl
            ? [{ id: item.imageUrl, url: item.imageUrl }]
            : []),
    images:
      item.images?.map((image) => ({ id: String(image.id), url: image.url })) ??
      item.thumbnailImages?.map((image) => ({ id: String(image.id), url: image.url })) ??
      (item.thumbnailImage
        ? [{ id: String(item.thumbnailImage.id), url: item.thumbnailImage.url }]
        : item.thumbnailImageUrl
          ? [{ id: item.thumbnailImageUrl, url: item.thumbnailImageUrl }]
          : item.imageUrl
            ? [{ id: item.imageUrl, url: item.imageUrl }]
            : undefined),
    thumbnailImage: toThumbnailImage(item),
    createdAt: item.createdAt ?? new Date().toISOString(),
    restaurantId: item.restaurantId ?? undefined,
    restaurantName: item.restaurantName ?? undefined,
    groupLogoImageUrl: item.groupLogoImageUrl ?? undefined,
    groupAddress: item.groupAddress ?? undefined,
    restaurantImageUrl: item.restaurantImageUrl ?? undefined,
    restaurantAddress: item.restaurantAddress ?? undefined,
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
    const payload: BackendReviewListPayload | undefined =
      res && typeof res === 'object' && ('items' in res || 'pagination' in res)
        ? res
        : (res as { data?: BackendReviewListPayload }).data
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
