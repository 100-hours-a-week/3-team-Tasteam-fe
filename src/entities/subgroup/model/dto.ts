import type { SuccessResponse } from '@/shared/types/api'
import type { ImageResource, IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type SubgroupListItemDto = {
  subgroupId: number
  name: string
  description: string
  memberCount: number
  joinType: 'OPEN' | 'PASSWORD'
  thumnailImage?: ImageResource
  profileImageUrl?: string | null
  createdAt: IsoDateTimeString
}

export type SubgroupListResponseDto = CursorPageResponse<SubgroupListItemDto>

export type SubgroupSearchItemDto = {
  subgroupId: number
  name: string
  description: string | null
  memberCount: number
  profileImageUrl?: string | null
  joinType: null
  createdAt: IsoDateTimeString
}

export type SubgroupSearchResponseDto = CursorPageResponse<SubgroupSearchItemDto>

export type SubgroupDetailDto = {
  groupId: number
  subgroupId: number
  name: string
  description: string
  memberCount: number
  thumnailImage?: ImageResource
  profileImageUrl?: string | null
  createdAt: IsoDateTimeString
}

export type SubgroupDetailResponseDto = SuccessResponse<{
  data: SubgroupDetailDto
}>

export type SubgroupCreateRequestDto = {
  name: string
  description?: string
  profileImageFileUuid?: string
  joinType: 'OPEN' | 'PASSWORD'
  password?: string | null
}

export type SubgroupCreateResponseDto = SuccessResponse<{
  id: number
  createdAt: IsoDateTimeString
}>

export type SubgroupMemberDto = {
  memberId: number
  nickname: string
  profileImage: ImageResource | null
  createdAt?: IsoDateTimeString
}

export type SubgroupMemberListResponseDto = SuccessResponse<CursorPageResponse<SubgroupMemberDto>>
