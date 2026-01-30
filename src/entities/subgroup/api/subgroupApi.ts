import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  SubgroupListResponseDto,
  SubgroupDetailResponseDto,
  SubgroupCreateRequestDto,
  SubgroupCreateResponseDto,
  SubgroupDetailDto,
  SubgroupMemberListResponseDto,
  SubgroupMemberDto,
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

export const getSubgroup = async (subgroupId: number): Promise<SubgroupDetailDto> => {
  const res = await request<SubgroupDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}`,
  })
  return res.data?.data ?? (res as unknown as { data: SubgroupDetailDto }).data
}

export const leaveSubgroup = (subgroupId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/subgroups/${subgroupId}/members/me`,
  })

export const getSubgroupReviews = (
  subgroupId: number,
  params?: { cursor?: string; size?: number },
) =>
  request<{ data?: ReviewListResponseDto }>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}/reviews${buildQuery(params ?? {})}`,
  }).then(
    (res) => res.data ?? { items: [], pagination: { nextCursor: null, size: 0, hasNext: false } },
  )

export const getSubgroupMembers = async (
  subgroupId: number,
  params?: { cursor?: string; size?: number },
): Promise<SubgroupMemberDto[]> => {
  const res = await request<SubgroupMemberListResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}/members${buildQuery(params ?? {})}`,
  })
  return res.data?.items ?? []
}

export const joinSubgroup = (groupId: number, subgroupId: number, password?: string) => {
  const payload = password?.trim() ? { password } : undefined
  return request<void>({
    method: 'POST',
    url: `/api/v1/groups/${groupId}/subgroups/${subgroupId}/members`,
    data: payload,
  })
}

export const createSubgroup = (groupId: number, payload: SubgroupCreateRequestDto) =>
  request<SubgroupCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/groups/${groupId}/subgroups`,
    data: payload,
  })
