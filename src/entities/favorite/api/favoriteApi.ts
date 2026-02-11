import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  FavoriteRestaurantListResponseDto,
  FavoriteCreateRequestDto,
  FavoriteCreateResponseDto,
  RestaurantFavoriteStatusResponseDto,
  SubgroupFavoriteListResponseDto,
  FavoriteTargetsResponseDto,
  RestaurantFavoriteTargetsResponseDto,
  SubgroupFavoriteRestaurantListResponseDto,
} from '../model/dto'

export const addRestaurantFavorite = (restaurantId: number) =>
  request<FavoriteCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/restaurants/${restaurantId}/favorite`,
  })

export const getMyFavoriteRestaurants = () =>
  request<FavoriteRestaurantListResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/favorites/restaurants',
  })

export const addMyFavoriteRestaurant = (payload: FavoriteCreateRequestDto) =>
  request<FavoriteCreateResponseDto>({
    method: 'POST',
    url: '/api/v1/members/me/favorites/restaurants',
    data: payload,
  })

export const deleteMyFavoriteRestaurant = (restaurantId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/members/me/favorites/restaurants/${restaurantId}`,
  })

export const getRestaurantFavoriteStatus = (restaurantId: number) =>
  request<RestaurantFavoriteStatusResponseDto>({
    method: 'GET',
    url: `/api/v1/restaurants/${restaurantId}/favorite-status`,
  })

export const getSubgroupFavorites = (subgroupId: number) =>
  request<SubgroupFavoriteListResponseDto>({
    method: 'GET',
    url: `/api/v1/subgroups/${subgroupId}/favorites`,
  })

export const addSubgroupFavorite = (subgroupId: number, payload: FavoriteCreateRequestDto) =>
  request<FavoriteCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/subgroups/${subgroupId}/favorites`,
    data: payload,
  })

export const deleteSubgroupFavorite = (subgroupId: number, restaurantId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/subgroups/${subgroupId}/favorites/${restaurantId}`,
  })

// 찜 타겟 목록 조회 (페이지용)
export const getFavoriteTargets = () =>
  request<FavoriteTargetsResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/favorite-targets',
  })

// 레스토랑 맥락용 찜 타겟 조회
export const getRestaurantFavoriteTargets = (restaurantId: number) =>
  request<RestaurantFavoriteTargetsResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/restaurants/${restaurantId}/favorite-targets`,
  })

// 하위그룹 찜 목록 조회 (새 경로)
export const getSubgroupFavoriteRestaurants = (
  subgroupId: number,
  params?: { cursor?: string; size?: number },
) =>
  request<SubgroupFavoriteRestaurantListResponseDto>({
    method: 'GET',
    url: `/api/v1/members/me/subgroups/${subgroupId}/favorites/restaurants${buildQuery(params ?? {})}`,
  })

// 하위그룹 찜 추가 (새 경로)
export const addSubgroupFavoriteRestaurant = (
  subgroupId: number,
  payload: FavoriteCreateRequestDto,
) =>
  request<FavoriteCreateResponseDto>({
    method: 'POST',
    url: `/api/v1/members/me/subgroups/${subgroupId}/favorites/restaurants`,
    data: payload,
  })

// 하위그룹 찜 삭제 (새 경로)
export const deleteSubgroupFavoriteRestaurant = (subgroupId: number, restaurantId: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/members/me/subgroups/${subgroupId}/favorites/restaurants/${restaurantId}`,
  })
