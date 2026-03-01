export const notificationKeys = {
  all: ['notification'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  list: (params?: object) => [...notificationKeys.all, 'list', params] as const,
}
