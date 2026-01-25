import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'

export type MainSectionType = 'SPONSORED' | 'HOT' | 'NEW' | 'AI_RECOMMEND' | (string & {})

export type MainBanner = {
  id: number
  imageUrl: string
  landingUrl: string
  order: number
}

export type MainBannerGroup = {
  enabled: boolean
  items: MainBanner[]
}

export type MainSectionItem = {
  restaurantId: number
  name: string
  distanceMeter: number
  category: string
  thumbnailImageUrl: string
  isFavorite: boolean
  reviewSummary: string
}

export type MainSection = {
  type: MainSectionType
  title: string
  items: MainSectionItem[]
}

export type MainResponse = SuccessResponse<{
  banners: MainBannerGroup
  sections: MainSection[]
}>

export type MainBannerEvent = MainBanner & {
  createdAt?: IsoDateTimeString
  updatedAt?: IsoDateTimeString
}
