import { useEffect, useState } from 'react'
import { getGroup } from '../api/groupApi'
import { isValidId } from '@/shared/lib/number'

export type GroupPreview = {
  id: number
  name: string
  imageUrl?: string
}

const LOADING_GROUP: GroupPreview = {
  id: 0,
  name: '그룹 정보를 불러오는 중...',
  imageUrl: undefined,
}

export function useGroupPreview(groupId: number | null) {
  const [groupInfo, setGroupInfo] = useState<GroupPreview>(LOADING_GROUP)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isValidId(groupId)) return

    let cancelled = false
    const fetchGroup = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getGroup(groupId)
        if (cancelled) return
        setGroupInfo({
          id: data.groupId,
          name: data.name,
          imageUrl: data.logoImageUrl ?? data.logoImage?.url ?? undefined,
        })
      } catch {
        if (cancelled) return
        setError('그룹 정보를 불러오지 못했습니다.')
        setGroupInfo({
          id: groupId,
          name: '그룹 정보를 불러오지 못했습니다.',
          imageUrl: undefined,
        })
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchGroup()
    return () => {
      cancelled = true
    }
  }, [groupId])

  return { groupInfo, isLoading, error }
}
