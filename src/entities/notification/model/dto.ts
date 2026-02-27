import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'

export type NotificationDto = {
  id: number
  notificationType: string
  title: string
  body: string
  deepLink: string
  createdAt: IsoDateTimeString
  readAt: IsoDateTimeString | null
}

export type NotificationListResponseDto = SuccessResponse<{
  items: NotificationDto[]
  page: number
  size: number
  totalPages: number
  totalElements: number
}>

export type NotificationReadRequestDto = {
  readAt: IsoDateTimeString
}

export type NotificationPreferencesResponseDto = SuccessResponse<
  Array<{
    channel: string
    notificationType: string
    isEnabled: boolean
  }>
>

export type NotificationPreferencesUpdateRequestDto = {
  notificationPreferences: Array<{
    channel: string
    notificationType: string
    isEnabled: boolean
  }>
}

export type UnreadNotificationCountResponseDto = SuccessResponse<{ count: number }>

export type PushNotificationTargetRequestDto = {
  deviceId: string
  fcmToken: string
}
