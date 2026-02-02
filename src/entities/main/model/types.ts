import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'

export type MainPageQuery = {
  latitude: number
  longitude: number
}

export type MainSectionType = 'SPONSORED' | 'HOT' | 'NEW' | 'AI_RECOMMEND' | (string & {})

export type MainBannerDto = {
  id: number
  imageUrl: string
  landingUrl: string
  order: number
}

export type MainBannerGroupDto = {
  enabled: boolean
  items: MainBannerDto[]
}

export type MainSectionItemDto = {
  restaurantId: number
  name: string
  distanceMeter: number
  category: string
  thumbnailImageUrl: string
  isFavorite: boolean
  reviewSummary: string
}

export type MainSectionDto = {
  type: MainSectionType
  title: string
  items: MainSectionItemDto[]
}

export type MainPageResponseDto = SuccessResponse<{
  banners: MainBannerGroupDto
  sections: MainSectionDto[]
}>

export type MainPageData = {
  sections: MainSectionDto[]
}

export type AiRecommendData = {
  section: MainSectionDto | null
}

export type MainBannerEvent = MainBannerDto & {
  createdAt?: IsoDateTimeString
  updatedAt?: IsoDateTimeString
}
