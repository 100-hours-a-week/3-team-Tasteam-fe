import { createContext } from 'react'
import type { MemberGroupSummaryItemDto } from './dto'

export type MemberGroupsContextValue = {
  summaries: MemberGroupSummaryItemDto[]
  isLoading: boolean
  isLoaded: boolean
  error: string | null
  isSubgroupMember: (subgroupId: number) => boolean
  refresh: () => Promise<void>
}

export const MemberGroupsContext = createContext<MemberGroupsContextValue | undefined>(undefined)
