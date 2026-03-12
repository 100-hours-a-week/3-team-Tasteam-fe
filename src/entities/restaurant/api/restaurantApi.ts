import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type { SuccessResponse } from '@/shared/types/api'
import type {
  RestaurantDetailResponseDto,
  FoodCategoryDto,
  RestaurantCreateRequestDto,
  RestaurantCreateResponseDto,
  RestaurantUpdateRequestDto,
  RestaurantUpdateResponseDto,
  RestaurantMenuResponseDto,
} from '../model/dto'

export const getRestaurant = (restaurantId: number) =>
  request<RestaurantDetailResponseDto>({
    method: 'GET',
    url: `/api/v1/restaurants/${restaurantId}`,
  })

export const getFoodCategories = async (): Promise<FoodCategoryDto[]> => {
  const res = await request<SuccessResponse<FoodCategoryDto[]> | FoodCategoryDto[]>({
    method: 'GET',
    url: '/api/v1/food-categories',
  })
  return Array.isArray(res) ? res : res.data
}

export const createRestaurant = (payload: RestaurantCreateRequestDto) =>
  request<RestaurantCreateResponseDto>({
    method: 'POST',
    url: '/api/v1/restaurants',
    data: payload,
  })

export const updateRestaurant = (restaurantId: number, payload: RestaurantUpdateRequestDto) =>
  request<RestaurantUpdateResponseDto>({
    method: 'PATCH',
    url: `/api/v1/restaurants/${restaurantId}`,
    data: payload,
  })

export const deleteRestaurant = (restaurantId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/restaurants/${restaurantId}`,
  })

export const getRestaurantMenus = (
  restaurantId: number,
  params?: {
    includeEmptyCategories?: boolean
    recommendedFirst?: boolean
  },
) =>
  request<RestaurantMenuResponseDto>({
    method: 'GET',
    url: `/api/v1/restaurants/${restaurantId}/menus${buildQuery(params ?? {})}`,
  })
