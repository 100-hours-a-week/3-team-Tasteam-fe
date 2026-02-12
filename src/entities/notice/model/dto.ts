import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'

export type NoticeDto = {
  id: number
  title: string
  content: string
  createdAt: IsoDateTimeString
  updatedAt: IsoDateTimeString
}

export type NoticeListResponseDto = SuccessResponse<{
  notices: NoticeDto[]
  totalCount: number
  hasNext: boolean
}>

export type NoticeDetailResponseDto = SuccessResponse<NoticeDto>
