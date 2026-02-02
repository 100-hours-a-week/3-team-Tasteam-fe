import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type { MainPageQuery, MainPageResponseDto } from '../model/types'

export const getMainPage = (params: MainPageQuery) =>
  request<MainPageResponseDto>({
    method: 'GET',
    url: `/api/v1/main${buildQuery(params)}`,
  })
