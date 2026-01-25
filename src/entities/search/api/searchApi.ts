import { mockRequest } from '@/shared/api/mockRequest'
import { buildQuery } from '@/shared/api/query'
import type { SearchResponse, RecentSearchesResponse } from '../model/types'

export const searchAll = (params: { keyword: string; cursor?: string; size?: number }) =>
  mockRequest<SearchResponse>({
    method: 'POST',
    url: `/api/v1/search${buildQuery(params)}`,
  })

export const getRecentSearches = () =>
  mockRequest<RecentSearchesResponse>({
    method: 'GET',
    url: '/api/v1/recent-searches',
  })

export const deleteRecentSearch = (id: number) =>
  mockRequest<void>({
    method: 'DELETE',
    url: `/api/v1/recent-searches/${id}`,
  })
