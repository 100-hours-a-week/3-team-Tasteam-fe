import { request } from '@/shared/api/request'
import type { SuccessResponse } from '@/shared/types/api'
import type { UploadGrantRequestDto, UploadGrantResponseDto } from '../model/dto'

export const createUploadGrant = (payload: UploadGrantRequestDto) =>
  request<SuccessResponse<UploadGrantResponseDto>>({
    method: 'POST',
    url: '/api/v1/files/uploads/presigned',
    data: payload,
  })

export const uploadFileToS3 = async (
  url: string,
  fields: Record<string, string>,
  file: File,
): Promise<void> => {
  const formData = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('file', file)

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.status}`)
  }
}
