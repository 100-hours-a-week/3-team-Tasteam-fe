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
  isFavorite?: boolean
  reviewSummary: string
}

export type MainSectionDto = {
  type: MainSectionType
  title: string
  items: MainSectionItemDto[]
}

export type HomeSectionItemDto = {
  restaurantId: number
  name: string
  distanceMeter: number
  foodCategories: string[]
  thumbnailImageUrl: string | null
  reviewSummary: string
}

export type HomeRecommendSectionDto = {
  type: 'RECOMMEND'
  title: string
  items: HomeSectionItemDto[]
}

export type HomeGroupedSectionGroupDto = {
  category: string
  title: string
  items: HomeSectionItemDto[]
}

export type HomeGroupedSectionDto = {
  type: 'HOT' | 'DISTANCE'
  title: string
  groups: HomeGroupedSectionGroupDto[]
}

export type HomeSectionDto =
  | HomeRecommendSectionDto
  | HomeGroupedSectionDto
  | {
      type: string
      title: string
      items?: HomeSectionItemDto[]
      groups?: HomeGroupedSectionGroupDto[]
    }

export type SplashEventDto = {
  id: number
  title: string
  content: string
  thumbnailImageUrl: string | null
  startAt: IsoDateTimeString
  endAt: IsoDateTimeString
  detailImageUrls?: string[]
}

export type MainPageResponseDto = SuccessResponse<{
  banners: MainBannerGroupDto
  sections: MainSectionDto[]
  splashPromotion?: SplashEventDto
}>

export type HomePageResponseDto = SuccessResponse<{
  banners: MainBannerGroupDto
  sections: HomeSectionDto[]
  splashPromotion?: SplashEventDto
}>

export type AiRecommendResponseDto = SuccessResponse<{
  section: MainSectionDto
}>

export type MainPageData = {
  sections: MainSectionDto[]
}

export type HomeCarouselSection = {
  type: 'RECOMMEND' | 'HOT'
  title: string
  items: MainSectionItemDto[]
}

export type HomeCategorySectionGroup = {
  category: string
  title: string
  items: MainSectionItemDto[]
}

export type HomeCategorySection = {
  type: 'HOT' | 'DISTANCE'
  title: string
  groups: HomeCategorySectionGroup[]
}

export type HomePageData = {
  heroSection: HomeCarouselSection | null
  distanceSection: HomeCategorySection | null
}

export type AiRecommendData = {
  section: MainSectionDto | null
}

export type MainBannerEvent = MainBannerDto & {
  createdAt?: IsoDateTimeString
  updatedAt?: IsoDateTimeString
}
