import type { IsoDateTimeString } from '@/shared/types/common'

export type UploadPurpose = 'REVIEW_IMAGE' | (string & {})

export type UploadFile = {
  contentType: string
  size: number
}

export type UploadGrant = {
  url: string
  fields: Record<string, string>
  expiresAt: IsoDateTimeString
  objectKey: string
}
