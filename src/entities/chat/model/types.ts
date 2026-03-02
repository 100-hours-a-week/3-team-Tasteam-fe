import type { IsoDateTimeString } from '@/shared/types/common'

export type ChatMessageType = 'TEXT' | 'IMAGE' | 'FILE' | (string & {})

export type ChatMessage = {
  id: number
  memberId: number
  memberNickname: string
  memberProfileImageUrl: string
  content: string | null
  messageType: ChatMessageType
  createdAt: IsoDateTimeString
}

export type ChatReadCursor = {
  roomId: number
  memberId: number
  lastReadMessageId: number
  updatedAt: IsoDateTimeString
}
