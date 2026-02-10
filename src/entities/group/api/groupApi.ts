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
  GroupDetailDto,
} from '../model/dto'
import type { CursorPageResponse } from '@/shared/types/pagination'
import type { RestaurantListItemDto } from '@/entities/restaurant'

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

export const getGroup = async (groupId: number): Promise<GroupDetailDto> => {
  const res = await request<GroupDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/groups/${groupId}`,
  })
  return res.data?.data ?? (res as unknown as { data: GroupDetailDto }).data
}

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

export const getGroupReviews = async (
  groupId: number,
  params?: { cursor?: string; size?: number },
): Promise<GroupReviewListResponseDto> => {
  const res = await request<{ data?: GroupReviewListResponseDto }>({
    method: 'GET',
    url: `/api/v1/groups/${groupId}/reviews${buildQuery(params ?? {})}`,
  })
  return res.data ?? { items: [], pagination: { nextCursor: null, size: 0, hasNext: false } }
}

export const getGroupReviewRestaurants = async (
  groupId: number,
  params: {
    latitude: number
    longitude: number
    cursor?: string
    size?: number
    categories?: string
  },
): Promise<CursorPageResponse<RestaurantListItemDto>> => {
  type BackendRestaurantListItem = {
    id: number
    name: string
    address: string
    distanceMeter: number
    foodCategories: string[]
    thumbnailImages: { id: number | string; url: string }[] | null
    reviewSummary?: string
  }

  const res = await request<CursorPageResponse<BackendRestaurantListItem>>({
    method: 'GET',
    url: `/api/v1/groups/${groupId}/reviews/restaurants${buildQuery(params ?? {})}`,
  })
  const items = (res.items ?? []).map<RestaurantListItemDto>((item) => {
    const firstImage = item.thumbnailImages?.[0]
    return {
      id: item.id,
      name: item.name,
      address: item.address,
      distanceMeter: item.distanceMeter,
      foodCategories: item.foodCategories,
      thumbnailImage: firstImage
        ? { id: String(firstImage.id), url: firstImage.url }
        : { id: String(item.id), url: '' },
      reviewSummary: item.reviewSummary,
    }
  })
  return {
    items,
    pagination: res.pagination ?? { nextCursor: null, size: 0, hasNext: false },
  }
}
