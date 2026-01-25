import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  RestaurantDetailResponseDto,
  RestaurantListResponseDto,
  RestaurantCreateRequestDto,
  RestaurantCreateResponseDto,
  RestaurantUpdateRequestDto,
  RestaurantUpdateResponseDto,
} from '../model/dto'

export const getRestaurant = (restaurantId: number) =>
  request<RestaurantDetailResponseDto>({
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
  request<RestaurantListResponseDto>({
    method: 'GET',
    url: `/api/v1/restaurants${buildQuery(params)}`,
  })

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
