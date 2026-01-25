import { request } from '@/shared/api/request'
import type { UploadGrantRequestDto, UploadGrantResponseDto } from '../model/dto'

export const createUploadGrant = (payload: UploadGrantRequestDto) =>
  request<UploadGrantResponseDto>({
    method: 'POST',
    url: '/api/v1/uploads',
    data: payload,
  })
