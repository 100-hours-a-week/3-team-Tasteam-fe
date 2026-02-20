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

const normalizeChatMessagesResponse = (response: unknown): ChatMessageListResponseDto => {
  if (!isRecord(response)) return emptyPage

  const payload = extractResponseData<unknown>(response)

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
    return {
      items: payload.data as ChatMessageListResponseDto['items'],
      pagination: {
        nextCursor: payload.page.nextCursor == null ? null : String(payload.page.nextCursor),
        size: typeof payload.page.size === 'number' ? payload.page.size : payload.data.length,
        hasNext: Boolean(payload.page.hasNext),
      },
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
  params?: { cursor?: string; size?: number },
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
