import type { SuccessResponse } from '@/shared/types/api'
import type { IsoDateTimeString } from '@/shared/types/common'
import type { CursorPageResponse } from '@/shared/types/pagination'

export type ChatMessageDto = {
  id: number
  memberId: number
  memberNickname: string
  memberProfileImageUrl: string
  content: string
  messageType: string
  createdAt: IsoDateTimeString
}

export type ChatMessageListResponseDto = CursorPageResponse<ChatMessageDto>

export type ChatMessageSendRequestDto = {
  messageType?: string
  content?: string
}

export type ChatMessageSendResponseDto = SuccessResponse<{
  id: number
  messageType: string
  content: string
  image: string | null
  createdAt: IsoDateTimeString
}>

export type ChatReadCursorRequestDto = {
  lastReadMessageId: number
}

export type ChatReadCursorResponseDto = SuccessResponse<{
  roomId: number
  memberId: number
  lastReadMessageId: number
  updatedAt: IsoDateTimeString
}>

export type MessageType = 'text' | 'image' | 'system'

export type MessageStatus = 'sending' | 'sent' | 'failed'

export type AttachmentType = 'image' | 'file'

export type AttachmentDto = {
  id: string
  type: AttachmentType
  url: string
  thumbnailUrl?: string
  width?: number
  height?: number
  sizeBytes?: number
  fileName?: string
}

export type ChatRoomDto = {
  id: number
  title: string
  memberCount: number
  lastMessage?: ChatMessageDto
  updatedAt: IsoDateTimeString
  unreadCount?: number
}

export type ReadStateDto = {
  roomId: number
  memberId: number
  lastReadMessageId: number
  lastReadAt: IsoDateTimeString
}

export type WSClientEvent =
  | { type: 'room.subscribe'; payload: { roomId: number; lastReceivedMessageId?: number } }
  | {
      type: 'message.send'
      payload: {
        roomId: number
        clientMessageId: string
        messageType: MessageType
        text?: string
        attachmentIds?: string[]
      }
    }
  | { type: 'message.retry'; payload: { roomId: number; clientMessageId: string } }
  | { type: 'read.update'; payload: { roomId: number; lastReadMessageId: number } }
  | { type: 'typing.start' | 'typing.stop'; payload: { roomId: number } }

export type WSServerEvent =
  | { type: 'message.created'; payload: { message: ChatMessageDto } }
  | {
      type: 'message.ack'
      payload: { clientMessageId: string; messageId: number; createdAt: IsoDateTimeString }
    }
  | { type: 'message.failed'; payload: { clientMessageId: string; errorCode: string } }
  | {
      type: 'read.updated'
      payload: {
        roomId: number
        memberId: number
        lastReadMessageId: number
        lastReadAt: IsoDateTimeString
      }
    }
  | {
      type: 'room.updated'
      payload: { roomId: number; lastMessage: ChatMessageDto; updatedAt: IsoDateTimeString }
    }
