import { request } from '@/shared/api/request'
import type { ReportCreateRequest } from '../model/types'
import type { SuccessResponse } from '@/shared/types/api'

export const createReport = (payload: ReportCreateRequest) =>
  request<SuccessResponse<void>>({
    method: 'POST',
    url: '/api/v1/reports',
    data: payload,
  })
