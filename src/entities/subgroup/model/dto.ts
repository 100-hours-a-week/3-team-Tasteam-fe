import type { SuccessResponse } from '@/shared/types/api'
import type { ImageResource, IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type SubgroupListItemDto = {
  subgroupId: number
  name: string
  description: string
  memberCount: number
  thumnailImage?: ImageResource
  createdAt: IsoDateTimeString
}

export type SubgroupListResponseDto = CursorPageResponse<SubgroupListItemDto>

export type SubgroupDetailDto = {
  groupId: number
  subgroupId: number
  name: string
  description: string
  memberCount: number
  thumnailImage?: ImageResource
  createdAt: IsoDateTimeString
}

export type SubgroupDetailResponseDto = SuccessResponse<SubgroupDetailDto>

export type SubgroupCreateRequestDto = {
  name?: string
  description?: string
  profileImageId?: string
  joinType?: string
  groupPassword?: string
}

export type SubgroupCreateResponseDto = SuccessResponse<{
  id: number
  createdAt: IsoDateTimeString
}>
