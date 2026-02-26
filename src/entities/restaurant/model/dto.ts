import type { SuccessResponse } from '@/shared/types/api'
import type { CursorPageResponse } from '@/shared/types/pagination'
import type {
  Coordinates,
  ImageResource,
  IsoDateTimeString,
  TimeString,
} from '@/shared/types/common'

export type RestaurantBusinessHourDto = {
  day: string
  open: TimeString
  close: TimeString
}

/** AI 근거 리뷰 1건 (API 응답) */
export type AiEvidenceDto = {
  reviewId: number
  snippet: string
  authorId?: number | null
  authorName?: string | null
  createdAt?: string | null
}

/** 카테고리별 리뷰 요약 상세 (맛/가격/서비스) */
export type AiCategorySummaryDto = {
  summary: string
  bullets?: string[]
  evidences: AiEvidenceDto[]
}

/** AI 리뷰 요약 전체 (overallSummary + categoryDetails) */
export type RestaurantAiSummaryDto = {
  overallSummary: string
  categoryDetails?: Record<string, AiCategorySummaryDto>
}

/** 카테고리별 비교 분석 상세 (맛/가격/서비스) */
export type AiCategoryComparisonDto = {
  summary: string
  bullets?: string[]
  evidences: AiEvidenceDto[]
  liftScore?: number | null
}

/** AI 비교 분석 전체 */
export type RestaurantAiComparisonDto = {
  overallComparison: string
  categoryDetails?: Record<string, AiCategoryComparisonDto>
}

/** AI 감정 분석 결과 */
export type RestaurantAiSentimentDto = {
  positivePercent: number
}

/** 음식점 상세용 AI 분석 결과 통합 */
export type RestaurantAiDetailsDto = {
  sentiment?: RestaurantAiSentimentDto | null
  summary?: RestaurantAiSummaryDto | null
  comparison?: RestaurantAiComparisonDto | null
}

export type RestaurantDetailDto = {
  id: number
  name: string
  address: string
  phoneNumber?: string | null
  location?: Coordinates
  distanceMeter?: number
  foodCategories: string[]
  businessHours?: RestaurantBusinessHourDto[]
  businessHoursWeek?: unknown
  images?: ImageResource[]
  image?: { id: number | string; url: string } | null
  isFavorite?: boolean
  recommendStat?: {
    recommendedCount: number
    notRecommendedCount: number
    positiveRatio: number
  }
  recommendedCount?: number
  aiDetails?: RestaurantAiDetailsDto | null
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

export type MenuItemDto = {
  id: number
  restaurantId: number | null
  name: string
  description: string | null
  price: number | null
  imageUrl: string | null
  isRecommended: boolean | null
  displayOrder: number | null
}

export type MenuCategoryDto = {
  id: number
  name: string
  displayOrder: number | null
  menus: MenuItemDto[]
}

export type RestaurantMenuDto = {
  restaurantId: number
  categories: MenuCategoryDto[]
}

export type RestaurantMenuResponseDto = SuccessResponse<RestaurantMenuDto>
