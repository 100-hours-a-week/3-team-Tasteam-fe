import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  MemberMeResponseDto,
  MemberProfileUpdateRequestDto,
  MemberGroupListResponseDto,
  MemberGroupOverviewListResponseDto,
  MemberGroupSummaryItemDto,
  MemberGroupSummaryListResponseDto,
  MemberGroupDetailSummaryItemDto,
  MemberGroupDetailSummaryListResponseDto,
  MemberGroupRequestListResponseDto,
  MemberReviewListResponseDto,
  GroupEmailVerificationResponseDto,
  GroupJoinVerificationResponseDto,
} from '../model/dto'
import type { SuccessResponse } from '@/shared/types/api'

export const getMe = () =>
  request<MemberMeResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me',
  })

export const deleteMe = () =>
  request<void>({
    method: 'DELETE',
    url: '/api/v1/members/me',
  })

export const updateMeProfile = (payload: MemberProfileUpdateRequestDto) =>
  request<void>({
    method: 'PATCH',
    url: '/api/v1/members/me/profile',
    data: payload,
  })

export const getMyGroups = (params?: { cursor?: string }) =>
  request<MemberGroupListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/groups${buildQuery(params ?? {})}`,
  })

export const getMyGroupsOverview = (params?: { cursor?: string }) =>
  request<MemberGroupOverviewListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/groups${buildQuery(params ?? {})}`,
  })

export const getMyGroupSummaries = async (): Promise<MemberGroupSummaryItemDto[]> => {
  const res = await request<MemberGroupSummaryListResponseDto | MemberGroupSummaryItemDto[]>({
    method: 'GET',
    url: '/api/v1/members/me/groups/summary',
  })
  return Array.isArray(res) ? res : res.data
}

export const getMyGroupDetails = async (): Promise<MemberGroupDetailSummaryItemDto[]> => {
  const res = await request<
    MemberGroupDetailSummaryListResponseDto | MemberGroupDetailSummaryItemDto[]
  >({
    method: 'GET',
    url: '/api/v1/members/me/groups',
  })
  return Array.isArray(res) ? res : res.data
}

export const getMyGroupRequests = (params?: { cursor?: string }) =>
  request<MemberGroupRequestListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/group-requests${buildQuery(params ?? {})}`,
  })

export const getMyReviews = (params?: { cursor?: string; size?: number }) =>
  request<SuccessResponse<MemberReviewListResponseDto>>({
    method: 'GET',
    url: `/api/v1/members/me/reviews${buildQuery(params ?? {})}`,
  })

export const sendGroupEmailVerification = (groupId: number, payload: { email: string }) =>
  request<GroupEmailVerificationResponseDto>({
    method: 'POST',
    url: `/api/v1/groups/${groupId}/email-verifications`,
    data: payload,
  })

export const verifyGroupEmailCode = (groupId: number, payload: { code: string }) =>
  request<GroupJoinVerificationResponseDto>({
    method: 'POST',
    url: `/api/v1/groups/${groupId}/email-authentications`,
    data: payload,
  })

export const verifyGroupPassword = (groupId: number, payload: { code: string }) =>
  request<GroupJoinVerificationResponseDto>({
    method: 'POST',
    url: `/api/v1/groups/${groupId}/password-authentications`,
    data: payload,
  })
