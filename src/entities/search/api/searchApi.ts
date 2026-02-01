import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type { SearchResponse, RecentSearchesResponse } from '../model/types'

export const searchAll = (params: { keyword: string; cursor?: string; size?: number }) =>
  request<SearchResponse>({
    method: 'POST',
    url: `/api/v1/search${buildQuery(params)}`,
  })

export const getRecentSearches = () =>
  request<RecentSearchesResponse>({
    method: 'GET',
    url: '/api/v1/recent-searches',
  })

export const addRecentSearch = (keyword: string) =>
  request<void>({
    method: 'POST',
    url: '/api/v1/recent-searches',
    data: { keyword },
  })

export const deleteRecentSearch = (id: number) =>
  request<void>({
    method: 'DELETE',
    url: `/api/v1/recent-searches/${id}`,
  })
