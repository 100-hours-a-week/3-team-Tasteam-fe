import { mockRequest } from '@/shared/api/mockRequest'
import type {
  NotificationListResponseDto,
  NotificationReadRequestDto,
  NotificationPreferencesResponseDto,
  NotificationPreferencesUpdateRequestDto,
  UnreadNotificationCountResponseDto,
  PushNotificationTargetRequestDto,
} from '../model/dto'

export const getNotifications = () =>
  mockRequest<NotificationListResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/notifications',
  })

export const markNotificationRead = (id: number, payload: NotificationReadRequestDto) =>
  mockRequest<void>({
    method: 'PATCH',
    url: `/api/v1/members/me/notifications/${id}`,
    data: payload,
  })

export const markAllNotificationsRead = (payload: NotificationReadRequestDto) =>
  mockRequest<void>({
    method: 'PATCH',
    url: '/api/v1/members/me/notifications',
    data: payload,
  })

export const getUnreadNotificationCount = () =>
  mockRequest<UnreadNotificationCountResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/notifications/unread',
  })

export const getNotificationPreferences = () =>
  mockRequest<NotificationPreferencesResponseDto>({
    method: 'GET',
    url: '/api/v1/members/me/notification-preferences',
  })

export const updateNotificationPreferences = (payload: NotificationPreferencesUpdateRequestDto) =>
  mockRequest<void>({
    method: 'PUT',
    url: '/api/v1/members/me/notification-preferences',
    data: payload,
  })

export const registerPushNotificationTarget = (payload: PushNotificationTargetRequestDto) =>
  mockRequest<void>({
    method: 'POST',
    url: '/api/v1/members/me/push-notification-targets',
    data: payload,
  })
