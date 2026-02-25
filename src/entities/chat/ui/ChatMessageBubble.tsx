import { RefreshCw, Check, CheckCheck, AlertCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'
import type { ChatMessageDto, MessageStatus } from '../model/dto'

type ExtendedChatMessage = ChatMessageDto & {
  status?: MessageStatus
  isRead?: boolean
}

type ChatMessageBubbleProps = {
  message: ExtendedChatMessage
  isOwn: boolean
  showAvatar?: boolean
  showSender?: boolean
  onRetry?: (message: ExtendedChatMessage) => void
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = hours < 12 ? '오전' : '오후'
  const hour12 = hours % 12 || 12
  return `${period} ${hour12}:${minutes}`
}

export function ChatMessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showSender = true,
  onRetry,
}: ChatMessageBubbleProps) {
  const normalizedType = message.messageType.toLowerCase()
  if (normalizedType === 'system') {
    return (
      <div className="flex justify-center py-2">
        <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs text-center max-w-[80%]">
          {message.content}
        </div>
      </div>
    )
  }

  const time = formatTime(message.createdAt)
  const fileUrl = message.files?.[0]?.fileUrl
  const isFileMessage = normalizedType === 'file'

  return (
    <div className={cn('flex gap-2 px-4 py-1', isOwn && 'flex-row-reverse')}>
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.memberProfileImageUrl ?? undefined} />
          <AvatarFallback>{message.memberNickname?.[0] || '?'}</AvatarFallback>
        </Avatar>
      )}
      {!isOwn && !showAvatar && <div className="w-8 flex-shrink-0" />}

      <div className={cn('flex flex-col gap-1 max-w-[70%]', isOwn && 'items-end')}>
        {!isOwn && showSender && message.memberNickname && (
          <span className="text-xs text-muted-foreground px-2">{message.memberNickname}</span>
        )}

        <div className={cn('flex items-end gap-1', isOwn && 'flex-row-reverse')}>
          <div
            className={cn(
              'rounded-2xl px-3 py-2',
              isOwn ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm',
              message.status === 'failed' && 'bg-destructive/10 border border-destructive',
              isFileMessage && fileUrl && 'p-1',
            )}
          >
            {isFileMessage && fileUrl ? (
              <div className="w-52 max-w-[60vw] overflow-hidden rounded-lg">
                <img
                  src={fileUrl}
                  alt="채팅 이미지"
                  className="h-auto max-h-72 w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              message.content && (
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              )
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
            {message.status === 'sending' && <span className="text-muted-foreground">전송 중</span>}
            {message.status === 'failed' && onRetry && (
              <Button
                size="sm"
                variant="ghost"
                className="h-5 px-1 text-xs text-destructive"
                onClick={() => onRetry(message)}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                재시도
              </Button>
            )}
            {(message.status === 'sent' || !message.status) && (
              <>
                <span>{time}</span>
                {isOwn &&
                  (message.isRead ? (
                    <CheckCheck className="h-3 w-3" />
                  ) : (
                    <Check className="h-3 w-3" />
                  ))}
              </>
            )}
          </div>
        </div>

        {message.status === 'failed' && (
          <div className="flex items-center gap-1 text-xs text-destructive px-2">
            <AlertCircle className="h-3 w-3" />
            <span>전송 실패</span>
          </div>
        )}
      </div>
    </div>
  )
}
