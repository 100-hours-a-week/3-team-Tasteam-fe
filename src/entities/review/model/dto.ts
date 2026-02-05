import type { SuccessResponse } from '@/shared/types/api'
import type { ImageResource, IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type ReviewListItemDto = {
  id: number
  groupId?: number
  subgroupId?: number | null
  groupName?: string
  subgroupName?: string | null
  author: {
    nickname: string
  }
  contentPreview: string
  isRecommended: boolean
  keywords: string[]
  images?: ImageResource[]
  thumbnailImage: ImageResource | null
  createdAt: IsoDateTimeString
  /** 하위그룹 리뷰 목록 등에서 제공 */
  restaurantId?: number | null
  restaurantName?: string | null
  /** 그룹 맥락 표시용 로고 이미지 URL */
  groupLogoImageUrl?: string | null
  /** 그룹 주소 (음식점 상세 리뷰 맥락 표시용) */
  groupAddress?: string | null
  /** 음식점 맥락 표시용 대표 이미지 URL */
  restaurantImageUrl?: string | null
  /** 음식점 주소 (하위그룹 리뷰 맥락 표시용) */
  restaurantAddress?: string | null
}

export type ReviewListResponseDto = CursorPageResponse<ReviewListItemDto>

export type ReviewDetailDto = {
  id: number
  restaurant: {
    id: number
    name: string
  }
  author: {
    id: number
    nickname: string
  }
  content: string
  isRecommended: boolean
  keywords: string[]
  images: ImageResource[]
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}

export type ReviewDetailResponseDto = SuccessResponse<ReviewDetailDto>

export type ReviewCreateRequestDto = {
  restaurantId?: number
  groupId?: number
  subgroupId?: number
  content?: string
  isRecommended?: boolean
  keywordIds?: number[]
  imageIds?: string[]
}

export type ReviewCreateResponseDto = SuccessResponse<{
  id: number
  createdAt: IsoDateTimeString
}>

export type ReviewKeywordItemDto = {
  id: number
  type: string
  name: string
}

export type ReviewKeywordListResponseDto = SuccessResponse<ReviewKeywordItemDto[]>
