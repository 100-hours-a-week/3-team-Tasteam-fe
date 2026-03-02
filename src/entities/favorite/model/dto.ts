import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type FavoriteRestaurantItemDto = {
  restaurantId: number
  name: string
  thumbnailUrl: string
  foodCategories: string[]
  category?: string
  address: string
  groupFavoriteCount?: number
  createdAt: IsoDateTimeString
}

// 백엔드는 SuccessResponse로 래핑: SuccessResponse<CursorPageResponse<FavoriteRestaurantItemDto>>
// request 함수가 response.data를 반환하므로 최종적으로는 CursorPageResponse 형태
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
  foodCategories: string[]
  category?: string
  address: string
  subgroupId: number
  favoritedAt: IsoDateTimeString
}

export type SubgroupFavoriteListResponseDto = CursorPageResponse<SubgroupFavoriteItemDto>

// 찜 타겟 정보
export type FavoriteTargetDto = {
  id: string // 'my' 또는 'subgroup-{subgroupId}'
  type: 'personal' | 'group'
  name: string
  subgroupId?: number // 그룹인 경우만
  groupName?: string // 그룹인 경우만
  favoriteCount?: number // 찜 개수 (선택적)
}

// 찜 타겟 목록 응답 (페이지용)
// 백엔드 응답 구조: { myFavorite: { favoriteCount }, subgroupFavorites: [{ subgroupId, name, favoriteCount }] }
export type FavoriteTargetsResponseDto = SuccessResponse<{
  myFavorite: {
    favoriteCount: number
  }
  subgroupFavorites: Array<{
    subgroupId: number
    name: string // subgroupName
    favoriteCount: number
  }>
}>

// 레스토랑 찜 타겟 응답 (현재 찜 상태 포함)
// 백엔드 응답 구조: { targets: [{ targetType: 'ME' | 'SUBGROUP', targetId: number | null, name: string, favoriteState: 'FAVORITED' | 'NOT_FAVORITED' }] }
export type RestaurantFavoriteTargetItemDto = {
  targetType: 'ME' | 'SUBGROUP'
  targetId: number | null
  name: string
  favoriteState: 'FAVORITED' | 'NOT_FAVORITED'
}

export type RestaurantFavoriteTargetsResponseDto = SuccessResponse<{
  targets: RestaurantFavoriteTargetItemDto[]
}>

// 하위그룹 찜 음식점 목록 응답 (새 경로)
// 백엔드는 SuccessResponse로 래핑: SuccessResponse<CursorPageResponse<FavoriteRestaurantItemDto>>
// request 함수가 response.data를 반환하므로 최종적으로는 CursorPageResponse 형태
export type SubgroupFavoriteRestaurantListResponseDto =
  CursorPageResponse<FavoriteRestaurantItemDto>
