import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  MemberMeResponseDto,
  MemberProfileUpdateRequestDto,
  MemberGroupListResponseDto,
  MemberGroupOverviewListResponseDto,
  MemberGroupSummaryItemDto,
  MemberGroupSummaryListResponseDto,
  MemberGroupRequestListResponseDto,
  MemberReviewListResponseDto,
  GroupEmailVerificationResponseDto,
  GroupJoinVerificationResponseDto,
} from '../model/dto'

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
  const res = await request<MemberGroupSummaryListResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/groups/summary',
  })
  return res.data
}

export const getMyGroupRequests = (params?: { cursor?: string }) =>
  request<MemberGroupRequestListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/group-requests${buildQuery(params ?? {})}`,
  })

export const getMyReviews = (params?: { cursor?: string }) =>
  request<MemberReviewListResponseDto>({
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
