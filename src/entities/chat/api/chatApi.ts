import { mockRequest } from '@/shared/api/mockRequest'
import { buildQuery } from '@/shared/api/query'
import type {
  ChatMessageListResponseDto,
  ChatMessageSendRequestDto,
  ChatMessageSendResponseDto,
  ChatReadCursorRequestDto,
  ChatReadCursorResponseDto,
} from '../model/dto'

export const getChatMessages = (chatRoomId: number, params?: { cursor?: string; size?: number }) =>
  mockRequest<ChatMessageListResponseDto>({
    method: 'GET',
    url: `/api/v1/chat-rooms/${chatRoomId}/messages${buildQuery(params ?? {})}`,
  })

export const sendChatMessage = (chatRoomId: number, payload: ChatMessageSendRequestDto) =>
  mockRequest<ChatMessageSendResponseDto>({
    method: 'POST',
    url: `/api/v1/chat-rooms/${chatRoomId}/messages`,
    data: payload,
  })

export const updateChatReadCursor = (chatRoomId: number, payload: ChatReadCursorRequestDto) =>
  mockRequest<ChatReadCursorResponseDto>({
    method: 'PATCH',
    url: `/api/v1/chat-rooms/${chatRoomId}/read-cursor`,
    data: payload,
  })
