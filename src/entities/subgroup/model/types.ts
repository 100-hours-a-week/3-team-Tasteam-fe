import type { ImageResource, IsoDateTimeString } from '@/shared/types/common'

export type SubgroupJoinType = 'PASSWORD' | 'FREE' | (string & {})

export type Subgroup = {
  subgroupId: number
  name: string
  description: string
  memberCount: number
  thumbnailImage?: ImageResource
  createdAt: IsoDateTimeString
}

export type SubgroupDetail = Subgroup & {
  groupId: number
}
