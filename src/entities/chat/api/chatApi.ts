import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import { extractResponseData } from '@/shared/lib/apiResponse'
import type {
  ChatMessageListResponseDto,
  ChatMessageSendRequestDto,
  ChatMessageSendResponseDto,
  ChatReadCursorRequestDto,
  ChatReadCursorResponseDto,
} from '../model/dto'

const emptyPage: ChatMessageListResponseDto = {
  items: [],
  pagination: { nextCursor: null, size: 0, hasNext: false },
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const extractChatPayload = (response: unknown): unknown => {
  if (!isRecord(response)) return response

  const directData = response.data
  if (isRecord(directData)) {
    if (isRecord(directData.page) || isRecord(directData.pagination)) {
      return directData
    }

    const nestedData = directData.data
    if (isRecord(nestedData)) {
      if (isRecord(nestedData.page) || isRecord(nestedData.pagination)) {
        return nestedData
      }
    }
  }

  return extractResponseData<unknown>(response)
}

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return Boolean(value)
}

const normalizePagePayload = (
  items: ChatMessageListResponseDto['items'],
  page: Record<string, unknown>,
): ChatMessageListResponseDto => ({
  items,
  pagination: {
    nextCursor: page.nextCursor == null ? null : String(page.nextCursor),
    size: typeof page.size === 'number' ? page.size : items.length,
    hasNext: toBoolean(page.hasNext),
  },
})

const normalizeChatMessagesResponse = (response: unknown): ChatMessageListResponseDto => {
  if (!isRecord(response)) return emptyPage

  const payload = extractChatPayload(response)

  if (isRecord(payload) && Array.isArray(payload.items) && isRecord(payload.pagination)) {
    return {
      items: payload.items as ChatMessageListResponseDto['items'],
      pagination: {
        nextCursor:
          payload.pagination.nextCursor == null ? null : String(payload.pagination.nextCursor),
        size:
          typeof payload.pagination.size === 'number'
            ? payload.pagination.size
            : payload.items.length,
        hasNext: Boolean(payload.pagination.hasNext),
      },
    }
  }

  if (isRecord(payload) && Array.isArray(payload.data) && isRecord(payload.page)) {
    return normalizePagePayload(payload.data as ChatMessageListResponseDto['items'], payload.page)
  }

  // Backward/variant support: { messages: [...], page: {...} } or { items: [...], page: {...} }
  if (isRecord(payload) && isRecord(payload.page)) {
    const pageItems = Array.isArray(payload.items)
      ? (payload.items as ChatMessageListResponseDto['items'])
      : Array.isArray(payload.messages)
        ? (payload.messages as ChatMessageListResponseDto['items'])
        : null

    if (pageItems) {
      return normalizePagePayload(pageItems, payload.page)
    }
  }

  if (Array.isArray(payload)) {
    return {
      items: payload as ChatMessageListResponseDto['items'],
      pagination: { nextCursor: null, size: payload.length, hasNext: false },
    }
  }

  return emptyPage
}

export const getChatMessages = async (
  chatRoomId: number,
  params?: { cursor?: string; size?: number; mode?: 'ENTER' | 'BEFORE' | 'AFTER' },
): Promise<ChatMessageListResponseDto> => {
  const res = await request<unknown>({
    method: 'GET',
    url: `/api/v1/chat-rooms/${chatRoomId}/messages${buildQuery(params ?? {})}`,
  })
  return normalizeChatMessagesResponse(res)
}

export const sendChatMessage = (chatRoomId: number, payload: ChatMessageSendRequestDto) =>
  request<ChatMessageSendResponseDto>({
    method: 'POST',
    url: `/api/v1/chat-rooms/${chatRoomId}/messages`,
    data: payload,
  })

export const updateChatReadCursor = (chatRoomId: number, payload: ChatReadCursorRequestDto) =>
  request<ChatReadCursorResponseDto>({
    method: 'PATCH',
    url: `/api/v1/chat-rooms/${chatRoomId}/read-cursor`,
    data: payload,
  })
