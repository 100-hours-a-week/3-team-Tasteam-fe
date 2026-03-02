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
  foodCategories: string[]
  category?: string
  thumbnailImageUrl: string
  isFavorite: boolean
  reviewSummary: string
}

export type MainSectionDto = {
  type: MainSectionType
  title: string
  items: MainSectionItemDto[]
}

export type SplashEventDto = {
  id: number
  title: string
  content: string
  thumbnailImageUrl: string | null
  startAt: IsoDateTimeString
  endAt: IsoDateTimeString
}

export type MainPageResponseDto = SuccessResponse<{
  banners: MainBannerGroupDto
  sections: MainSectionDto[]
  splashPromotion?: SplashEventDto
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
