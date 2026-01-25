import type { IsoDateTimeString } from '@/shared/types/common'
import type { CursorPagination } from '@/shared/types/pagination'

export type MemberProfile = {
  nickname: string
  profileImageUrl: string
}

export type MemberGroupRequestSummary = {
  id: number
  groupName: string
  groupAddress: string
  status: string
}

export type MemberReviewSummary = {
  id: number
  restaurantName: string
  restaurantAddress: string
  reviewContent: string
}

export type MemberGroupSummary = {
  id: number
  groupName: string
  groupAddress: string
}

export type MemberMeOverview = {
  member: MemberProfile
  groupRequests: {
    data: MemberGroupRequestSummary[]
    page: CursorPagination
  }
  reviews: {
    data: MemberReviewSummary[]
    page: CursorPagination
  }
}

export type MemberGroupList = {
  data: MemberGroupSummary[]
  page: CursorPagination
}

export type MemberGroupRequestList = {
  data: MemberGroupRequestSummary[]
  page: CursorPagination
}

export type MemberReviewList = {
  data: MemberReviewSummary[]
  page: CursorPagination
}

export type MemberProfileUpdate = {
  profileImageUrl?: string
  email?: string
}

export type MemberJoinedAt = {
  verified: boolean
  joinedAt: IsoDateTimeString
}
