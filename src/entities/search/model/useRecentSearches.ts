import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/entities/user/model/useAuth'
import {
  addRecentSearch as apiAddRecentSearch,
  deleteRecentSearch,
  getRecentSearches,
} from '../api/searchApi'
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

  useEffect(() => {
    if (isAuthenticated) {
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
    } else {
      setRecentSearches(loadFromStorage())
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
        try {
          await apiAddRecentSearch(keyword)
          const response = await getRecentSearches()
          setRecentSearches(response.data.items || [])
        } catch {
          return
        }
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

  return { recentSearches, remove, add }
}
