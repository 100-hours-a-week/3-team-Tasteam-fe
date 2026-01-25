import type { ImageResource, IsoDateTimeString } from '@/shared/types/common'

export type ReviewAuthor = {
  id?: number
  nickname: string
}

export type ReviewRestaurantRef = {
  id: number
  name: string
}

export type Review = {
  id: number
  restaurant: ReviewRestaurantRef
  author: ReviewAuthor
  content: string
  isRecommended: boolean
  keywords: string[]
  images: ImageResource[]
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}

export type ReviewListItem = {
  id: number
  author: ReviewAuthor
  contentPreview: string
  isRecommended: boolean
  keywords: string[]
  thumbnailImage: ImageResource
  createdAt: IsoDateTimeString
}
