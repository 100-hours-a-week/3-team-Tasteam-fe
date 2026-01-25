import { request } from '@/shared/api/request'
import type {
  FavoriteRestaurantListResponseDto,
  FavoriteCreateRequestDto,
  FavoriteCreateResponseDto,
  RestaurantFavoriteStatusResponseDto,
  SubgroupFavoriteListResponseDto,
} from '../model/dto'

export const addRestaurantFavorite = (restaurantId: number) =>
  request<FavoriteCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/restaurants/${restaurantId}/favorite`,
  })

export const getMyFavoriteRestaurants = () =>
  request<FavoriteRestaurantListResponseDto>({
    method: 'GET',
    url: '/members/me/favorites/restaurants',
  })

export const addMyFavoriteRestaurant = (payload: FavoriteCreateRequestDto) =>
  request<FavoriteCreateResponseDto>({
    method: 'POST',
    url: '/members/me/favorites/restaurants',
    data: payload,
  })

export const deleteMyFavoriteRestaurant = (restaurantId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/me/favorites/restaurants/${restaurantId}`,
  })

export const getRestaurantFavoriteStatus = (restaurantId: number) =>
  request<RestaurantFavoriteStatusResponseDto>({
    method: 'GET',
    url: `/restaurants/${restaurantId}/favorite-status`,
  })

export const getSubgroupFavorites = (subgroupId: number) =>
  request<SubgroupFavoriteListResponseDto>({
    method: 'GET',
    url: `/subgroups/${subgroupId}/favorites`,
  })

export const addSubgroupFavorite = (subgroupId: number, payload: FavoriteCreateRequestDto) =>
  request<FavoriteCreateResponseDto>({
    method: 'POST',
    url: `/subgroups/${subgroupId}/favorites`,
    data: payload,
  })

export const deleteSubgroupFavorite = (subgroupId: number, restaurantId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/subgroups/${subgroupId}/favorites/${restaurantId}`,
  })
