import { useCallback, useEffect, useMemo, useState } from 'react'
import { MemberGroupsContext } from './memberGroupsContext'
import type { MemberGroupsContextValue } from './memberGroupsContext'
import type { MemberGroupSummaryItemDto } from './dto'
import { getMyGroupSummaries } from '@/entities/member/api/memberApi'
import { useAuth } from '@/entities/user/model/useAuth'

export const MemberGroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const [summaries, setSummaries] = useState<MemberGroupSummaryItemDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMyGroupSummaries()
      setSummaries(data)
      setIsLoaded(true)
    } catch {
      setSummaries([])
      setIsLoaded(true)
      setError('Failed to load member groups')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setSummaries([])
      setIsLoaded(false)
      setIsLoading(false)
      setError(null)
      return
    }
    refresh()
  }, [isAuthenticated, refresh])

  const subgroupIdSet = useMemo(() => {
    const set = new Set<number>()
    for (const group of summaries) {
      for (const subgroup of group.subGroups ?? []) {
        set.add(subgroup.subGroupId)
      }
    }
    return set
  }, [summaries])

  const isSubgroupMember = useCallback(
    (subgroupId: number) => subgroupIdSet.has(subgroupId),
    [subgroupIdSet],
  )

  const value = useMemo<MemberGroupsContextValue>(
    () => ({
      summaries,
      isLoading,
      isLoaded,
      error,
      isSubgroupMember,
      refresh,
    }),
    [summaries, isLoading, isLoaded, error, isSubgroupMember, refresh],
  )

  return <MemberGroupsContext.Provider value={value}>{children}</MemberGroupsContext.Provider>
}
