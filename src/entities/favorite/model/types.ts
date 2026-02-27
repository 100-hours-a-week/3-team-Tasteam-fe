import type { IsoDateTimeString } from '@/shared/types/common'

export type FavoriteState = 'NOT_FAVORITED' | 'FAVORITED_BY_ME' | (string & {})

export type FavoriteRestaurantItem = {
  restaurantId: number
  name: string
  thumbnailUrl: string
  foodCategories: string[]
  category?: string
  address: string
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

// 찜 타겟 타입
export type FavoriteTarget = {
  id: string // 'my' 또는 'subgroup-{subgroupId}'
  type: 'personal' | 'group'
  name: string
  subgroupId?: number
  groupName?: string
  favoriteCount?: number
  isFavorited?: boolean // 레스토랑 맥락에서만 사용
}

// 찜 탭 타입
export type FavoriteTab = 'personal' | 'group'

// 하위그룹 정보 (그룹 선택 시트용)
export type SubgroupInfo = {
  subgroupId: number
  name: string
  groupName: string
  favoriteCount: number
}
