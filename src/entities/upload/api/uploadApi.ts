import { mockRequest } from '@/shared/api/mockRequest'
import type { UploadGrantRequestDto, UploadGrantResponseDto } from '../model/dto'

export const createUploadGrant = (payload: UploadGrantRequestDto) =>
  mockRequest<UploadGrantResponseDto>({
    method: 'POST',
    url: '/api/v1/uploads',
    data: payload,
  })
