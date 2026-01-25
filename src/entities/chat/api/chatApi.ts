import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  ChatMessageListResponseDto,
  ChatMessageSendRequestDto,
  ChatMessageSendResponseDto,
  ChatReadCursorRequestDto,
  ChatReadCursorResponseDto,
} from '../model/dto'

export const getChatMessages = (chatRoomId: number, params?: { cursor?: string; size?: number }) =>
  request<ChatMessageListResponseDto>({
    method: 'GET',
    url: `/chat-rooms/${chatRoomId}/messages${buildQuery(params ?? {})}`,
  })

export const sendChatMessage = (chatRoomId: number, payload: ChatMessageSendRequestDto) =>
  request<ChatMessageSendResponseDto>({
    method: 'POST',
    url: `/chat-rooms/${chatRoomId}/messages`,
    data: payload,
  })

export const updateChatReadCursor = (chatRoomId: number, payload: ChatReadCursorRequestDto) =>
  request<ChatReadCursorResponseDto>({
    method: 'PATCH',
    url: `/chat-rooms/${chatRoomId}/read-cursor`,
    data: payload,
  })
