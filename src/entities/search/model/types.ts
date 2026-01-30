import type { SuccessResponse } from '@/shared/types/api'
import type { ImageResource, IsoDateTimeString } from '@/shared/types/common'
import type { ItemsPageResponse } from '@/shared/types/pagination'

export type SearchGroupItem = {
  groupId: number
  name: string
  logoImage: ImageResource | null
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
  createdAt: IsoDateTimeString
}

export type RecentSearchesResponse = SuccessResponse<RecentSearch[]>
