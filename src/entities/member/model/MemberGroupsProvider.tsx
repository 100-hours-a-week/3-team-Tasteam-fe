import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MemberGroupsContext } from './memberGroupsContext'
import type { MemberGroupsContextValue } from './memberGroupsContext'
import { memberKeys } from './memberKeys'
import { getMyGroupSummaries } from '@/entities/member'
import { useAuth } from '@/entities/user'

export const MemberGroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: summaries = [],
    isLoading,
    isFetched,
    error,
  } = useQuery({
    queryKey: memberKeys.groupSummaries(),
    queryFn: getMyGroupSummaries,
    enabled: isAuthenticated,
  })

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: memberKeys.groupSummaries() }),
    [queryClient],
  )

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
      isLoaded: isFetched,
      error: error ? String(error) : null,
      isSubgroupMember,
      refresh,
    }),
    [summaries, isLoading, isFetched, error, isSubgroupMember, refresh],
  )

  return <MemberGroupsContext.Provider value={value}>{children}</MemberGroupsContext.Provider>
}
