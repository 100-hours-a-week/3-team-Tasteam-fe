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
