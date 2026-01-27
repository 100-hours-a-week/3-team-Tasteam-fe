import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  SubgroupListResponseDto,
  SubgroupDetailResponseDto,
  SubgroupCreateRequestDto,
  SubgroupCreateResponseDto,
} from '../model/dto'
import type { ReviewListResponseDto } from '@/entities/review/model/dto'

export const getMySubgroups = (groupId: number, params?: { cursor?: string; size?: number }) =>
  request<SubgroupListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/groups/${groupId}/subgroups${buildQuery(params ?? {})}`,
  })

export const getSubgroups = (groupId: number, params?: { cursor?: string; size?: number }) =>
  request<SubgroupListResponseDto>({
    method: 'GET',
    url: `/api/v1/groups/${groupId}/subgroups${buildQuery(params ?? {})}`,
  })

export const getSubgroup = (subgroupId: number) =>
  request<SubgroupDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}`,
  })

export const leaveSubgroup = (subgroupId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/subgroups/${subgroupId}/members/me`,
  })

export const getSubgroupReviews = (
  subgroupId: number,
  params?: { cursor?: string; size?: number },
) =>
  request<ReviewListResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}/reviews${buildQuery(params ?? {})}`,
  })

export const createSubgroup = (groupId: number, payload: SubgroupCreateRequestDto) =>
  request<SubgroupCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/groups/${groupId}/subgroups`,
    data: payload,
  })
