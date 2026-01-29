import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type { MainResponse } from '../model/types'

export const getMainPage = (params: { latitude: number; longitude: number }) =>
  request<MainResponse>({
    method: 'GET',
    url: `/api/v1/main${buildQuery(params)}`,
  })
