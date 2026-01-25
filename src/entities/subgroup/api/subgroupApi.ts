import { mockRequest } from '@/shared/api/mockRequest'
import { buildQuery } from '@/shared/api/query'
import type {
  SubgroupListResponseDto,
  SubgroupDetailResponseDto,
  SubgroupCreateRequestDto,
  SubgroupCreateResponseDto,
} from '../model/dto'
import type { ReviewListResponseDto } from '@/entities/review/model/dto'

export const getMySubgroups = (groupId: number, params?: { cursor?: string; size?: number }) =>
  mockRequest<SubgroupListResponseDto>({
    method: 'GET',
    url: `/members/me/groups/${groupId}/subgroups${buildQuery(params ?? {})}`,
  })

export const getSubgroups = (groupId: number, params?: { cursor?: string; size?: number }) =>
  mockRequest<SubgroupListResponseDto>({
    method: 'GET',
    url: `/groups/${groupId}/subgroups${buildQuery(params ?? {})}`,
  })

export const getSubgroup = (subgroupId: number) =>
  mockRequest<SubgroupDetailResponseDto>({
    method: 'GET',
    url: `/subgroups/${subgroupId}`,
  })

export const leaveSubgroup = (subgroupId: number) =>
  mockRequest<void>({
    method: 'DELETE',
    url: `/subgroups/${subgroupId}/members/me`,
  })

export const getSubgroupReviews = (
  subgroupId: number,
  params?: { cursor?: string; size?: number },
) =>
  mockRequest<ReviewListResponseDto>({
    method: 'GET',
    url: `/subgroups/${subgroupId}/reviews${buildQuery(params ?? {})}`,
  })

export const createSubgroup = (groupId: number, payload: SubgroupCreateRequestDto) =>
  mockRequest<SubgroupCreateResponseDto>({
    method: 'POST',
    url: `/groups/${groupId}/subgroups`,
    data: payload,
  })
