import { mockRequest } from '@/shared/api/mockRequest'
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
