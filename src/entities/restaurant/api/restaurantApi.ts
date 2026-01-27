import { mockRequest } from '@/shared/api/mockRequest'
import { buildQuery } from '@/shared/api/query'
import { request } from '@/shared/api/request'
import type { SuccessResponse } from '@/shared/types/api'
import type { CursorPageResponse } from '@/shared/types/pagination'
import type {
  RestaurantDetailResponseDto,
  RestaurantListResponseDto,
  RestaurantListItemDto,
  RestaurantCreateRequestDto,
  RestaurantCreateResponseDto,
  RestaurantUpdateRequestDto,
  RestaurantUpdateResponseDto,
} from '../model/dto'

export const getRestaurant = (restaurantId: number) =>
  mockRequest<RestaurantDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/restaurants/${restaurantId}`,
  })

export const getRestaurants = (params: {
  latitude: number
  longitude: number
  cursor?: string
  size?: number
  category?: string
}) =>
  mockRequest<RestaurantListResponseDto>({
    method: 'GET',
    url: `/api/v1/restaurants${buildQuery(params)}`,
  })

/**
 * 백엔드 mock 응답(`data.items[].thumbnailImages`)을
 * 프론트 DTO(`thumbnailImage`)로 안전하게 변환하는 홈 전용 래퍼.
 */
type BackendRestaurantListItem = {
  id: number
  name: string
  address: string
  distanceMeter: number
  foodCategories: string[]
  thumbnailImages: { id: number; url: string }[] | null
}

type BackendRestaurantListResponse = SuccessResponse<CursorPageResponse<BackendRestaurantListItem>>

export const getRestaurantsForHome = async (params: {
  latitude: number
  longitude: number
  cursor?: string
  size?: number
  category?: string
}): Promise<CursorPageResponse<RestaurantListItemDto>> => {
  const response = await request<BackendRestaurantListResponse>({
    method: 'GET',
    url: `/api/v1/restaurants${buildQuery(params)}`,
  })

  const items = response.data.items.map<RestaurantListItemDto>((item) => {
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
    }
  })

  return {
    items,
    pagination: response.data.pagination,
  }
}

export const createRestaurant = (payload: RestaurantCreateRequestDto) =>
  mockRequest<RestaurantCreateResponseDto>({
    method: 'POST',
    url: '/api/v1/restaurants',
    data: payload,
  })

export const updateRestaurant = (restaurantId: number, payload: RestaurantUpdateRequestDto) =>
  mockRequest<RestaurantUpdateResponseDto>({
    method: 'PATCH',
    url: `/api/v1/restaurants/${restaurantId}`,
    data: payload,
  })

export const deleteRestaurant = (restaurantId: number) =>
  mockRequest<void>({
    method: 'DELETE',
    url: `/api/v1/restaurants/${restaurantId}`,
  })
