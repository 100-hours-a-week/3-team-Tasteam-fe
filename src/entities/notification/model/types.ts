import type { IsoDateTimeString } from '@/shared/types/common'

export type NotificationType = 'CHAT' | (string & {})
export type NotificationChannel = 'PUSH' | 'EMAIL' | 'SMS' | (string & {})

export type Notification = {
  id: number
  notificationType: NotificationType
  title: string
  body: string
  deepLink: string
  createdAt: IsoDateTimeString
  readAt: IsoDateTimeString | null
}

export type NotificationPreference = {
  channel: NotificationChannel
  notificationType: NotificationType
  isEnabled: boolean
}
