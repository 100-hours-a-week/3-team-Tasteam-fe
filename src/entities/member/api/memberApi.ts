import { mockRequest } from '@/shared/api/mockRequest'
import { buildQuery } from '@/shared/api/query'
import type {
  MemberMeResponseDto,
  MemberProfileUpdateRequestDto,
  MemberGroupListResponseDto,
  MemberGroupOverviewListResponseDto,
  MemberGroupRequestListResponseDto,
  MemberReviewListResponseDto,
  GroupEmailVerificationResponseDto,
  GroupJoinVerificationResponseDto,
} from '../model/dto'

export const getMe = () =>
  mockRequest<MemberMeResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me',
  })

export const deleteMe = () =>
  mockRequest<void>({
    method: 'DELETE',
    url: '/api/v1/members/me',
  })

export const updateMeProfile = (payload: MemberProfileUpdateRequestDto) =>
  mockRequest<void>({
    method: 'PATCH',
    url: '/api/v1/members/me/profile',
    data: payload,
  })

export const getMyGroups = (params?: { cursor?: string }) =>
  mockRequest<MemberGroupListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/groups${buildQuery(params ?? {})}`,
  })

export const getMyGroupsOverview = (params?: { cursor?: string }) =>
  mockRequest<MemberGroupOverviewListResponseDto>({
    method: 'GET',
    url: `/members/me/groups${buildQuery(params ?? {})}`,
  })

export const getMyGroupRequests = (params?: { cursor?: string }) =>
  mockRequest<MemberGroupRequestListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/group-requests${buildQuery(params ?? {})}`,
  })

export const getMyReviews = (params?: { cursor?: string }) =>
  mockRequest<MemberReviewListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/reviews${buildQuery(params ?? {})}`,
  })

export const sendGroupEmailVerification = (groupId: number, payload: { email: string }) =>
  mockRequest<GroupEmailVerificationResponseDto>({
    method: 'POST',
    url: `/groups/${groupId}/email-verifications`,
    data: payload,
  })

export const verifyGroupEmailCode = (groupId: number, payload: { code: string }) =>
  mockRequest<GroupJoinVerificationResponseDto>({
    method: 'POST',
    url: `/groups/${groupId}/email-authentications`,
    data: payload,
  })

export const verifyGroupPassword = (groupId: number, payload: { code: string }) =>
  mockRequest<GroupJoinVerificationResponseDto>({
    method: 'POST',
    url: `/groups/${groupId}/password-authentications`,
    data: payload,
  })
