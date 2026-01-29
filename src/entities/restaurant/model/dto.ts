import type { SuccessResponse } from '@/shared/types/api'
import type {
  Coordinates,
  ImageResource,
  IsoDateTimeString,
  TimeString,
} from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type RestaurantBusinessHourDto = {
  day: string
  open: TimeString
  close: TimeString
}

export type RestaurantDetailDto = {
  id: number
  name: string
  address: string
  location: Coordinates
  distanceMeter: number
  foodCategories: string[]
  businessHours: RestaurantBusinessHourDto[]
  images: ImageResource[]
  isFavorite?: boolean
  recommendStat?: {
    recommendedCount: number
    notRecommendedCount: number
    positiveRatio: number
  }
  aiSummary?: string
  aiFeatures?: string
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}

export type RestaurantDetailResponseDto = SuccessResponse<RestaurantDetailDto>

export type RestaurantListItemDto = {
  id: number
  name: string
  address: string
  distanceMeter: number
  foodCategories: string[]
  thumbnailImage: ImageResource
  reviewSummary?: string
}

export type FoodCategoryDto = {
  id: number
  name: string
}

export type RestaurantListResponseDto = CursorPageResponse<RestaurantListItemDto>

export type RestaurantCreateRequestDto = {
  name: string
  address: {
    text: string
    sido: string
    sigungu: string
    postalCode: string
  }
  location: Coordinates
  foodCategoryIds?: number[]
  imageIds?: string[]
  businessHours?: RestaurantBusinessHourDto[]
}

export type RestaurantCreateResponseDto = SuccessResponse<{
  id: number
  createdAt: IsoDateTimeString
}>

export type RestaurantUpdateRequestDto = RestaurantCreateRequestDto

export type RestaurantUpdateResponseDto = SuccessResponse<{
  id: number
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}>
