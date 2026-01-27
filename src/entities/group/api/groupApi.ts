import { request } from '@/shared/api/request'
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
  request<GroupRequestCreateResponseDto>({
    method: 'POST',
    url: '/api/v1/group-requests',
    data: payload,
  })

export const createGroup = (payload: GroupCreateRequestDto) =>
  request<GroupCreateResponseDto>({
    method: 'POST',
    url: '/api/v1/groups',
    data: payload,
  })

export const getGroup = (groupId: number) =>
  request<GroupDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/groups/${groupId}`,
  })

export const updateGroup = (groupId: number, payload: GroupUpdateRequestDto) =>
  request<void>({
    method: 'PATCH',
    url: `/api/v1/groups/${groupId}`,
    data: payload,
  })

export const deleteGroup = (groupId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/groups/${groupId}`,
  })

export const leaveGroup = (groupId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/groups/${groupId}/members/me`,
  })

export const getGroupMembers = (groupId: number, params?: { cursor?: string; size?: number }) =>
  request<GroupMemberListResponseDto>({
    method: 'GET',
    url: `/api/v1/groups/${groupId}/members${buildQuery(params ?? {})}`,
  })

export const deleteGroupMember = (groupId: number, userId: number) =>
  request<void>({
    method: 'GET',
    url: `/api/v1/groups/${groupId}/members/${userId}`,
  })

export const getGroupReviews = (groupId: number, params?: { cursor?: string; size?: number }) =>
  request<GroupReviewListResponseDto>({
    method: 'GET',
    url: `/api/v1/groups/${groupId}/reviews${buildQuery(params ?? {})}`,
  })
