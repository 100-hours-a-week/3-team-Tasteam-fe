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
  SubgroupSearchResponseDto,
} from '../model/dto'
import type { ReviewListResponseDto } from '@/entities/review'
import type { SuccessResponse } from '@/shared/types/api'

export const getMySubgroups = (groupId: number, params?: { cursor?: string; size?: number }) =>
  request<SubgroupListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/groups/${groupId}/subgroups${buildQuery(params ?? {})}`,
  })

export const getSubgroups = async (
  groupId: number,
  params?: { cursor?: string; size?: number },
): Promise<SubgroupListResponseDto> => {
  const response = await request<
    SuccessResponse<SubgroupListResponseDto> | SubgroupListResponseDto
  >({
    method: 'GET',
    url: `/api/v1/groups/${groupId}/subgroups${buildQuery(params ?? {})}`,
  })

  if ('data' in response) {
    return response.data
  }
  return response as SubgroupListResponseDto
}

export const searchSubgroups = async (
  groupId: number,
  params?: { keyword?: string; cursor?: string; size?: number },
): Promise<SubgroupSearchResponseDto> => {
  const trimmedKeyword = params?.keyword?.trim()
  const response = await request<
    SuccessResponse<SubgroupSearchResponseDto> | SubgroupSearchResponseDto
  >({
    method: 'GET',
    url: `/api/v1/groups/${groupId}/subgroups/search${buildQuery({
      ...params,
      keyword: trimmedKeyword ? trimmedKeyword : undefined,
    })}`,
  })

  if ('data' in response) {
    return response.data
  }
  return response as SubgroupSearchResponseDto
}

export const getSubgroup = async (subgroupId: number): Promise<SubgroupDetailDto> => {
  const res = await request<SubgroupDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}`,
  })
  const payload = (res as { data?: unknown }).data
  if (payload && typeof payload === 'object') {
    const nested = (payload as { data?: unknown }).data
    if (nested && typeof nested === 'object' && 'subgroupId' in nested) {
      return nested as SubgroupDetailDto
    }
    if ('subgroupId' in payload) {
      return payload as SubgroupDetailDto
    }
  }
  return res as unknown as SubgroupDetailDto
}

export const leaveSubgroup = (subgroupId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/subgroups/${subgroupId}/members/me`,
  })

export const getSubgroupReviews = (
  subgroupId: number,
  params?: { cursor?: string; size?: number },
): Promise<ReviewListResponseDto> =>
  request<
    | ReviewListResponseDto
    | {
        data?: {
          items: ReviewListResponseDto['items']
          pagination: ReviewListResponseDto['pagination']
        }
      }
  >({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}/reviews${buildQuery(params ?? {})}`,
  }).then((res) => {
    if ('data' in res && res.data) {
      return res.data
    }
    if ('items' in res && 'pagination' in res) {
      return res as ReviewListResponseDto
    }
    return { items: [], pagination: { nextCursor: null, size: 0, hasNext: false } }
  })

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
