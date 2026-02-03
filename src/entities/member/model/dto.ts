import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type MemberProfileDto = {
  nickname: string
  profileImageUrl?: string | null
}

export type MemberMeResponseDto = SuccessResponse<{
  member: MemberProfileDto
  groupRequests: {
    items: Array<{
      id: number
      groupName: string
      groupAddress: string
      status: string
    }>
    hasMore: boolean
  }
  reviews: {
    items: Array<{
      id: number
      restaurantName: string
      restaurantAddress: string
      reviewContent: string
    }>
    hasMore: boolean
  }
}>

export type MemberGroupListResponseDto = CursorPageResponse<{
  id: number
  groupName: string
  groupAddress: string
}>

export type MemberGroupOverviewListResponseDto = CursorPageResponse<{
  groupId: number
  name: string
  logoImage: {
    id: string
    url: string
  }
  address: string
  detailAddress: string
  emailDomain: string | null
  status: string
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
  subgroups: Array<{
    subgroupId: number
    name: string
    description: string
    memberCount: number
    thumbnailImage: {
      id: string
      url: string
    }
    createdAt: IsoDateTimeString
  }>
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
  nickname?: string
  profileImageFileUuid?: string
  email?: string
  bio?: string
}

export type MemberGroupSummaryItemDto = {
  groupId: number
  groupName: string
  subGroups: MemberSubgroupSummaryItemDto[]
}

export type MemberGroupSummaryListResponseDto = SuccessResponse<MemberGroupSummaryItemDto[]>

export type MemberSubgroupSummaryItemDto = {
  subGroupId: number
  subGroupName: string
}

export type MemberSubgroupDetailSummaryItemDto = {
  subGroupId: number
  subGroupName: string
  memberCount: number
  logoImageUrl?: string | null
}

export type MemberGroupDetailSummaryItemDto = {
  groupId: number
  groupName: string
  groupAddress: string
  groupDetailAddress?: string | null
  groupLogoImageUrl?: string | null
  groupMemberCount: number
  subGroups: MemberSubgroupDetailSummaryItemDto[]
}

export type MemberGroupDetailSummaryListResponseDto = SuccessResponse<
  MemberGroupDetailSummaryItemDto[]
>

export type GroupEmailVerificationResponseDto = SuccessResponse<{
  id: number
  createdAt: IsoDateTimeString
  expiresAt: IsoDateTimeString
}>

export type GroupJoinVerificationResponseDto = SuccessResponse<{
  verified: boolean
  joinedAt: IsoDateTimeString
}>
