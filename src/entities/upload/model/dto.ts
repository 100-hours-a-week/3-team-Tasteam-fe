import type { UploadFile, UploadPurpose } from './types'

export type UploadGrantRequestDto = {
  purpose: UploadPurpose
  files: UploadFile[]
}

export type UploadGrantResponseDto = {
  uploads: Array<{
    fileUuid: string
    url: string
    fields: Record<string, string>
    expiresAt: string
    objectKey: string
  }>
}
