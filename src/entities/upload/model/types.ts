import type { IsoDateTimeString } from '@/shared/types/common'

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const
export const ALLOWED_IMAGE_EXTENSIONS = 'JPEG, JPG, PNG, WebP'
export const MAX_IMAGE_SIZE_MB = 10
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const MIN_IMAGE_SIZE_BYTES = 1
export const MAX_FILENAME_LENGTH = 256

export type UploadPurpose =
  | 'REVIEW_IMAGE'
  | 'RESTAURANT_IMAGE'
  | 'PROFILE_IMAGE'
  | 'GROUP_IMAGE'
  | 'COMMON_ASSET'
  | (string & {})

export type UploadFile = {
  fileName: string
  contentType: string
  size: number
}

export type UploadGrant = {
  fileUuid: string
  url: string
  fields: Record<string, string>
  expiresAt: IsoDateTimeString
  objectKey: string
}
