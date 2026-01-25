import type { SuccessResponse } from '@/shared/types/api'
import type { Coordinates, ImageResource, IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type GroupCreateRequestDto = {
  name: string
  imageIds: string
  address: string
  detailAddress: string | null
  location: Coordinates
  joinType: string
  emailDomain: string | null
}

export type GroupCreateResponseDto = SuccessResponse<{
  id: number
  status: string
  createdAt: IsoDateTimeString
}>

export type GroupRequestCreateDto = {
  memberId: number
  name: string
  joinType: string
  email: string
  address: {
    address: string
    detailAddress: string | null
    postalCode: string
  }
}

export type GroupRequestCreateResponseDto = SuccessResponse<{
  id: number
  status: string
  createdAt: IsoDateTimeString
}>

export type GroupDetailDto = {
  groupId: number
  name: string
  logoImage: ImageResource
  address: string
  detail_address: string
  emailDomain: string | null
  status: string
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}

export type GroupDetailResponseDto = SuccessResponse<GroupDetailDto>

export type GroupUpdateRequestDto = {
  name?: string
  imageIds?: string
  address?: string
  detail_address?: string
  emailDomain?: string | null
  status?: string
}

export type GroupMemberDto = {
  memberId: number
  nickname: string
  profileImage: string
  createdAt: IsoDateTimeString
}

export type GroupMemberListResponseDto = CursorPageResponse<GroupMemberDto>

export type GroupReviewListItemDto = {
  id: number
  author: {
    nickname: string
  }
  contentPreview: string
  isRecommended: boolean
  keywords: string[]
  thumbnailImage: ImageResource
  createdAt: IsoDateTimeString
}

export type GroupReviewListResponseDto = CursorPageResponse<GroupReviewListItemDto>
