import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/entities/user/model/useAuth'
import { deleteRecentSearch, getRecentSearches } from '../api/searchApi'
import type { RecentSearch } from './types'

const STORAGE_KEY = 'recent_searches'
const MAX_LOCAL_ITEMS = 20

function loadFromStorage(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(items: RecentSearch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_LOCAL_ITEMS)))
}

let localIdCounter = Date.now()

export function useRecentSearches() {
  const { isAuthenticated } = useAuth()
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  const refresh = useCallback(() => {
    if (isAuthenticated) {
      getRecentSearches()
        .then((response) => {
          setRecentSearches(response.data.items || [])
        })
        .catch(() => {
          setRecentSearches([])
        })
      return
    }

    setRecentSearches(loadFromStorage())
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      setRecentSearches(loadFromStorage())
      return
    }

    let active = true
    getRecentSearches()
      .then((response) => {
        if (active) setRecentSearches(response.data.items || [])
      })
      .catch(() => {
        if (active) setRecentSearches([])
      })

    return () => {
      active = false
    }
  }, [isAuthenticated])

  const remove = useCallback(
    async (id: number) => {
      if (isAuthenticated) {
        try {
          await deleteRecentSearch(id)
        } catch {
          return
        }
      }
      setRecentSearches((prev) => {
        const next = prev.filter((item) => item.id !== id)
        if (!isAuthenticated) saveToStorage(next)
        return next
      })
    },
    [isAuthenticated],
  )

  const add = useCallback(
    async (keyword: string) => {
      if (isAuthenticated) {
        return
      } else {
        setRecentSearches((prev) => {
          const filtered = prev.filter((item) => item.keyword !== keyword)
          const next = [
            { id: localIdCounter++, keyword, updatedAt: new Date().toISOString() },
            ...filtered,
          ].slice(0, MAX_LOCAL_ITEMS)
          saveToStorage(next)
          return next
        })
      }
    },
    [isAuthenticated],
  )

  return { recentSearches, remove, add, refresh }
}
