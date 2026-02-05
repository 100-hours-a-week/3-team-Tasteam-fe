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
