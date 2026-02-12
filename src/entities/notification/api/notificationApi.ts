import { request } from '@/shared/api/request'
import type {
  NotificationListResponseDto,
  NotificationReadRequestDto,
  NotificationPreferencesResponseDto,
  NotificationPreferencesUpdateRequestDto,
  UnreadNotificationCountResponseDto,
  PushNotificationTargetRequestDto,
} from '../model/dto'

export const getNotifications = () =>
  request<NotificationListResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/notifications',
  })

export const markNotificationRead = (id: number, payload: NotificationReadRequestDto) =>
  request<void>({
    method: 'PATCH',
    url: `/api/v1/members/me/notifications/${id}`,
    data: payload,
  })

export const markAllNotificationsRead = (payload: NotificationReadRequestDto) =>
  request<void>({
    method: 'PATCH',
    url: '/api/v1/members/me/notifications',
    data: payload,
  })

export const getUnreadNotificationCount = () =>
  request<UnreadNotificationCountResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/notifications/unread',
  })

export const getNotificationPreferences = () =>
  request<NotificationPreferencesResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/notification-preferences',
  })

export const updateNotificationPreferences = (payload: NotificationPreferencesUpdateRequestDto) =>
  request<void>({
    method: 'PATCH',
    url: '/api/v1/members/me/notification-preferences',
    data: payload,
  })

export const registerPushNotificationTarget = (payload: PushNotificationTargetRequestDto) =>
  request<void>({
    method: 'POST',
    url: '/api/v1/members/me/push-notification-targets',
    data: payload,
  })
