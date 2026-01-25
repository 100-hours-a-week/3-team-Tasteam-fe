import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type FavoriteRestaurantItemDto = {
  restaurantId: number
  name: string
  thumbnailUrl: string
  createdAt: IsoDateTimeString
}

export type FavoriteRestaurantListResponseDto = CursorPageResponse<FavoriteRestaurantItemDto>

export type FavoriteCreateRequestDto = {
  restaurantId: number
}

export type FavoriteCreateResponseDto = SuccessResponse<{
  id: number
  restaurantId: number
  createdAt: IsoDateTimeString
}>

export type RestaurantFavoriteStatusDto = {
  restaurantId: number
  my_favorite: {
    favoriteState: string
  }
  group_favorites: Array<{
    subgroupId: number
    subgroupName: string
    groupName: string
    favoriteState: string
  }>
}

export type RestaurantFavoriteStatusResponseDto = SuccessResponse<RestaurantFavoriteStatusDto>

export type SubgroupFavoriteItemDto = {
  restaurantId: number
  name: string
  thumbnailUrl: string
  subgroupId: number
  favoritedAt: IsoDateTimeString
}

export type SubgroupFavoriteListResponseDto = CursorPageResponse<SubgroupFavoriteItemDto>
