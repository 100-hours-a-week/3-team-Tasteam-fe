import type {
  Coordinates,
  ImageResource,
  IsoDateTimeString,
  TimeString,
} from '@/shared/types/common'

export type BusinessDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN' | (string & {})

export type BusinessHour = {
  day: BusinessDay
  open: TimeString
  close: TimeString
}

export type RestaurantAddress = {
  text: string
  sido: string
  sigungu: string
  postalCode: string
}

export type Restaurant = {
  id: number
  name: string
  address: string
  location: Coordinates
  distanceMeter?: number
  foodCategories: string[]
  businessHours: BusinessHour[]
  images: ImageResource[]
  isFavorite?: boolean
  recommendStat?: RestaurantRecommendStat
  aiSummary?: string
  aiFeatures?: string
  createdAt?: IsoDateTimeString
  updatedAt?: IsoDateTimeString
}

export type RestaurantThumbnail = {
  id: string
  url: string
}

export type RestaurantListItem = {
  id: number
  name: string
  address: string
  distanceMeter: number
  foodCategories: string[]
  thumbnailImage: RestaurantThumbnail
}

export type RestaurantRecommendStat = {
  recommendedCount: number
  notRecommendedCount: number
  positiveRatio: number
}
