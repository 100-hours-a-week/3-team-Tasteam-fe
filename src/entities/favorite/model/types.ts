import type { IsoDateTimeString } from '@/shared/types/common'

export type FavoriteState = 'NOT_FAVORITED' | 'FAVORITED_BY_ME' | (string & {})

export type FavoriteRestaurantItem = {
  restaurantId: number
  name: string
  thumbnailUrl: string
  createdAt?: IsoDateTimeString
}

export type SubgroupFavoriteRestaurantItem = {
  restaurantId: number
  name: string
  thumbnailUrl: string
  subgroupId: number
  favoritedAt: IsoDateTimeString
}

export type RestaurantFavoriteStatus = {
  restaurantId: number
  myFavorite: {
    favoriteState: FavoriteState
  }
  groupFavorites: Array<{
    subgroupId: number
    subgroupName: string
    groupName: string
    favoriteState: FavoriteState
  }>
}
