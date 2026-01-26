import { mockRequest } from '@/shared/api/mockRequest'
import type {
  FavoriteRestaurantListResponseDto,
  FavoriteCreateRequestDto,
  FavoriteCreateResponseDto,
  RestaurantFavoriteStatusResponseDto,
  SubgroupFavoriteListResponseDto,
} from '../model/dto'

export const addRestaurantFavorite = (restaurantId: number) =>
  mockRequest<FavoriteCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/restaurants/${restaurantId}/favorite`,
  })

export const getMyFavoriteRestaurants = () =>
  mockRequest<FavoriteRestaurantListResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/favorites/restaurants',
  })

export const addMyFavoriteRestaurant = (payload: FavoriteCreateRequestDto) =>
  mockRequest<FavoriteCreateResponseDto>({
    method: 'POST',
    url: '/api/v1/members/me/favorites/restaurants',
    data: payload,
  })

export const deleteMyFavoriteRestaurant = (restaurantId: number) =>
  mockRequest<void>({
    method: 'DELETE',
    url: `/api/v1/members/me/favorites/restaurants/${restaurantId}`,
  })

export const getRestaurantFavoriteStatus = (restaurantId: number) =>
  mockRequest<RestaurantFavoriteStatusResponseDto>({
    method: 'GET',
    url: `/api/v1/restaurants/${restaurantId}/favorite-status`,
  })

export const getSubgroupFavorites = (subgroupId: number) =>
  mockRequest<SubgroupFavoriteListResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}/favorites`,
  })

export const addSubgroupFavorite = (subgroupId: number, payload: FavoriteCreateRequestDto) =>
  mockRequest<FavoriteCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/subgroups/${subgroupId}/favorites`,
    data: payload,
  })

export const deleteSubgroupFavorite = (subgroupId: number, restaurantId: number) =>
  mockRequest<void>({
    method: 'DELETE',
    url: `/api/v1/subgroups/${subgroupId}/favorites/${restaurantId}`,
  })
