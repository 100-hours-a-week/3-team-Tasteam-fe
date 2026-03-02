import type { GetNoticesParams } from '../api/noticeApi'

export const noticeKeys = {
  all: ['reference', 'notices'] as const,
  list: (params?: GetNoticesParams) => [...noticeKeys.all, 'list', params] as const,
  detail: (id: number) => [...noticeKeys.all, id] as const,
}
