import { useCallback, useEffect, useMemo, useState } from 'react'
import { MemberGroupsContext } from './memberGroupsContext'
import type { MemberGroupsContextValue } from './memberGroupsContext'
import type { MemberGroupSummaryItemDto } from './dto'
import { getMyGroupSummaries } from '@/entities/member/api/memberApi'
import { useAuth } from '@/entities/user/model/useAuth'

const MEMBER_GROUP_SUMMARY_CACHE_KEY = 'member:group-summaries:v1'

const loadSummaryCache = (): MemberGroupSummaryItemDto[] | null => {
  try {
    const raw = sessionStorage.getItem(MEMBER_GROUP_SUMMARY_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { summaries?: MemberGroupSummaryItemDto[] }
    return Array.isArray(parsed?.summaries) ? parsed.summaries : null
  } catch {
    return null
  }
}

const saveSummaryCache = (summaries: MemberGroupSummaryItemDto[]) => {
  try {
    sessionStorage.setItem(
      MEMBER_GROUP_SUMMARY_CACHE_KEY,
      JSON.stringify({ summaries, cachedAt: Date.now() }),
    )
  } catch {
    // ignore storage errors
  }
}

const clearSummaryCache = () => {
  try {
    sessionStorage.removeItem(MEMBER_GROUP_SUMMARY_CACHE_KEY)
  } catch {
    // ignore storage errors
  }
}

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
      saveSummaryCache(data)
      setIsLoaded(true)
    } catch {
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
      clearSummaryCache()
      return
    }
    const cached = loadSummaryCache()
    if (cached) {
      setSummaries(cached)
      setIsLoaded(true)
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
