import { mockRequest } from '@/shared/api/mockRequest'
import { buildQuery } from '@/shared/api/query'
import type {
  GroupCreateRequestDto,
  GroupCreateResponseDto,
  GroupRequestCreateDto,
  GroupRequestCreateResponseDto,
  GroupDetailResponseDto,
  GroupUpdateRequestDto,
  GroupMemberListResponseDto,
  GroupReviewListResponseDto,
} from '../model/dto'

export const createGroupRequest = (payload: GroupRequestCreateDto) =>
  mockRequest<GroupRequestCreateResponseDto>({
    method: 'POST',
    url: '/group-requests',
    data: payload,
  })

export const createGroup = (payload: GroupCreateRequestDto) =>
  mockRequest<GroupCreateResponseDto>({
    method: 'POST',
    url: '/groups',
    data: payload,
  })

export const getGroup = (groupId: number) =>
  mockRequest<GroupDetailResponseDto>({
    method: 'GET',
    url: `/groups/${groupId}`,
  })

export const updateGroup = (groupId: number, payload: GroupUpdateRequestDto) =>
  mockRequest<void>({
    method: 'PATCH',
    url: `/groups/${groupId}`,
    data: payload,
  })

export const deleteGroup = (groupId: number) =>
  mockRequest<void>({
    method: 'DELETE',
    url: `/groups/${groupId}`,
  })

export const leaveGroup = (groupId: number) =>
  mockRequest<void>({
    method: 'DELETE',
    url: `/groups/${groupId}/members/me`,
  })

export const getGroupMembers = (groupId: number, params?: { cursor?: string; size?: number }) =>
  mockRequest<GroupMemberListResponseDto>({
    method: 'GET',
    url: `/groups/${groupId}/members${buildQuery(params ?? {})}`,
  })

export const deleteGroupMember = (groupId: number, userId: number) =>
  mockRequest<void>({
    method: 'GET',
    url: `/groups/${groupId}/members/${userId}`,
  })

export const getGroupReviews = (groupId: number, params?: { cursor?: string; size?: number }) =>
  mockRequest<GroupReviewListResponseDto>({
    method: 'GET',
    url: `/groups/${groupId}/reviews${buildQuery(params ?? {})}`,
  })
