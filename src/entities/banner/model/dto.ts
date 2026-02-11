import type { SuccessResponse } from '@/shared/types/api'

export type BannerDto = {
  id: number
  imageUrl: string
  title: string | null
  deeplinkUrl: string
  bgColor: string | null
  displayOrder: number
}

export type BannerListResponseDto = SuccessResponse<{
  banners: BannerDto[]
}>
