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
  SubgroupChatRoomResponseDto,
} from '../model/dto'
import type { ReviewListResponseDto } from '@/entities/review'
import type { SuccessResponse } from '@/shared/types/api'
import { extractResponseData } from '@/shared/lib/apiResponse'

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

  return (
    extractResponseData<SubgroupListResponseDto>(response) ?? {
      items: [],
      pagination: { nextCursor: null, size: 0, hasNext: false },
    }
  )
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

  return (
    extractResponseData<SubgroupSearchResponseDto>(response) ?? {
      items: [],
      pagination: { nextCursor: null, size: 0, hasNext: false },
    }
  )
}

export const getSubgroup = async (subgroupId: number): Promise<SubgroupDetailDto> => {
  const res = await request<SubgroupDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}`,
  })
  const payload = extractResponseData<SubgroupDetailDto>(res)
  if (payload && typeof payload === 'object' && 'subgroupId' in payload) {
    return payload
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
    const payload = extractResponseData<ReviewListResponseDto>(res)
    if (payload && typeof payload === 'object' && 'items' in payload && 'pagination' in payload) {
      return payload
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
  return extractResponseData<SubgroupMemberListResponseDto['data']>(res)?.items ?? []
}

export const getSubgroupChatRoomId = async (subgroupId: number): Promise<number> => {
  const res = await request<SubgroupChatRoomResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}/chat-room`,
  })
  const payload = extractResponseData<{ chatRoomId: number }>(res)
  if (payload && typeof payload.chatRoomId === 'number') {
    return payload.chatRoomId
  }
  throw new Error('채팅방 정보를 불러오지 못했습니다.')
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
