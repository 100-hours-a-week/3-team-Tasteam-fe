import { mockRequest } from '@/shared/api/mockRequest'
import { buildQuery } from '@/shared/api/query'
import type { MainResponse } from '../model/types'

export const getMainPage = (params: { latitude: number; longitude: number }) =>
  mockRequest<MainResponse>({
    method: 'GET',
    url: `/api/v1/main${buildQuery(params)}`,
  })
