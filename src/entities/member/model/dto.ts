import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse, CursorPagination } from '@/shared/types/pagination'

export type MemberProfileDto = {
  nickname: string
  profileImageUrl: string
}

export type MemberMeResponseDto = SuccessResponse<{
  member: MemberProfileDto
  groupRequests: {
    data: Array<{
      id: number
      groupName: string
      groupAddress: string
      status: string
    }>
    page: CursorPagination
  }
  reviews: {
    data: Array<{
      id: number
      restaurantName: string
      restaurantAddress: string
      reviewContent: string
    }>
    page: CursorPagination
  }
}>

export type MemberGroupListResponseDto = CursorPageResponse<{
  id: number
  groupName: string
  groupAddress: string
}>

export type MemberGroupRequestListResponseDto = CursorPageResponse<{
  id: number
  groupName: string
  groupAddress: string
  status: string
}>

export type MemberReviewListResponseDto = CursorPageResponse<{
  id: number
  restaurantName: string
  restaurantAddress: string
  reviewContent: string
}>

export type MemberProfileUpdateRequestDto = {
  profileImageUrl?: string
  email?: string
}

export type GroupJoinVerificationResponseDto = SuccessResponse<{
  verified: boolean
  joinedAt: IsoDateTimeString
}>
