import type { Coordinates, ImageResource, IsoDateTimeString } from '@/shared/types/common'

export type GroupStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | (string & {})
export type GroupJoinType = 'WORK-EMAIL' | 'PASSWORD' | (string & {})

export type Group = {
  groupId: number
  name: string
  logoImage?: ImageResource | null
  address: string
  detailAddress?: string | null
  emailDomain?: string | null
  status?: GroupStatus
  createdAt?: IsoDateTimeString
  updatedAt?: IsoDateTimeString
}

export type GroupSummary = {
  groupId: number
  name: string
  logoImage: ImageResource | null
  memberCount: number
}

export type GroupMember = {
  memberId: number
  nickname: string
  profileImage: ImageResource
  createdAt: IsoDateTimeString
}

export type GroupRequest = {
  id: number
  status: GroupStatus
  createdAt: IsoDateTimeString
}

export type GroupCreatePayload = {
  name: string
  logoImageId?: string
  address: string
  detailAddress?: string | null
  location: Coordinates
  joinType: GroupJoinType
  emailDomain?: string | null
}
