import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'
import type { ItemsPageResponse } from '@/shared/types/pagination'

export type SearchGroupItem = {
  groupId: number
  name: string
  logoImageUrl: string | null
  memberCount: number
}

export type SearchRestaurantItem = {
  restaurantId: number
  name: string
  address: string
  imageUrl: string
}

export type SearchResponse = SuccessResponse<{
  groups: SearchGroupItem[]
  restaurants: ItemsPageResponse<SearchRestaurantItem>
}>

export type RecentSearch = {
  id: number
  keyword: string
  updatedAt: IsoDateTimeString
}

export type RecentSearchesResponse = SuccessResponse<{
  items: RecentSearch[]
  pagination: {
    page: number
    size: number
    totalPages: number
    totalElements: number
  }
}>
