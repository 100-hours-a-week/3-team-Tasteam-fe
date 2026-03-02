import { ROUTES } from '@/shared/config/routes'

const CHAT_ROOMS_PREFIX = '/chat-rooms/'

export const normalizeNotificationDeepLink = (deepLink: string): string => {
  if (deepLink.startsWith(CHAT_ROOMS_PREFIX)) {
    const roomId = deepLink.slice(CHAT_ROOMS_PREFIX.length)
    if (roomId) return ROUTES.chatRoom(roomId)
  }
  return deepLink
}
