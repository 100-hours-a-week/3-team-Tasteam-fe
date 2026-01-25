import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, Users } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ChatInput } from '@/widgets/chat-input'
import { ListState } from '@/widgets/list-state'
import { Button } from '@/shared/ui/button'
import { ChatMessageBubble, ChatDateDivider } from '@/entities/chat/ui'
import type { ChatMessageDto } from '@/entities/chat/model/dto'

type ChatRoomPageProps = {
  roomId: string
  roomTitle: string
  memberCount?: number
  currentUserId: string
  onBack: () => void
  onMembersClick?: () => void
}

export function ChatRoomPage({
  roomId,
  roomTitle,
  memberCount,
  currentUserId,
  onBack,
  onMembersClick,
}: ChatRoomPageProps) {
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isAtBottom = useRef(true)

  useEffect(() => {
    const loadInitialMessages = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const mockMessages: ChatMessageDto[] = [
          {
            id: 1,
            memberId: 100,
            memberNickname: '김철수',
            memberProfileImageUrl: '',
            messageType: 'system',
            content: '김철수님이 입장하셨습니다.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 2,
            memberId: 100,
            memberNickname: '김철수',
            memberProfileImageUrl: '',
            messageType: 'text',
            content: '안녕하세요! 반갑습니다.',
            createdAt: new Date(Date.now() - 86400000 + 1000).toISOString(),
          },
          {
            id: 3,
            memberId: Number(currentUserId),
            memberNickname: '',
            memberProfileImageUrl: '',
            messageType: 'text',
            content: '네, 안녕하세요!',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 4,
            memberId: 101,
            memberNickname: '이영희',
            memberProfileImageUrl: '',
            messageType: 'text',
            content: '오늘 점심 뭐 드셨나요?',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ]
        setMessages(mockMessages)
        scrollToBottom(true)
      } catch {
        toast.error('메시지를 불러오지 못했어요')
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialMessages()
  }, [roomId, currentUserId])

  const handleScroll = useCallback(() => {
    const container = scrollAreaRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const atBottom = distanceFromBottom < 80
    isAtBottom.current = atBottom
    setShowScrollButton(!atBottom)

    if (scrollTop < 100 && !isLoadingMore && hasMore) {
      loadOlderMessages()
    }
  }, [isLoadingMore, hasMore])

  const loadOlderMessages = async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setHasMore(false)
    } catch {
      toast.error('이전 메시지를 불러오지 못했어요')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleSendMessage = useCallback(
    (text: string) => {
      const newMessage: ChatMessageDto = {
        id: Date.now(),
        memberId: Number(currentUserId),
        memberNickname: '',
        memberProfileImageUrl: '',
        messageType: 'text',
        content: text,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, newMessage])
      scrollToBottom(true)
    },
    [currentUserId],
  )

  const scrollToBottom = (force = false) => {
    const container = scrollAreaRef.current
    if (!container) return
    if (force || isAtBottom.current) {
      container.scrollTop = container.scrollHeight
      setShowScrollButton(false)
    }
  }

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt)
      const dateKey = format(date, 'yyyy-MM-dd')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
      return groups
    },
    {} as Record<string, ChatMessageDto[]>,
  )

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background min-h-screen">
        <TopAppBar
          title={roomTitle}
          showBackButton
          onBack={onBack}
          actions={
            memberCount && onMembersClick ? (
              <Button variant="ghost" size="sm" onClick={onMembersClick}>
                <Users className="h-4 w-4 mr-1" />
                {memberCount}
              </Button>
            ) : undefined
          }
        />
        <div className="flex-1 flex items-center justify-center">
          <ListState type="loading" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar
        title={roomTitle}
        showBackButton
        onBack={onBack}
        actions={
          memberCount && onMembersClick ? (
            <Button variant="ghost" size="sm" onClick={onMembersClick}>
              <Users className="h-4 w-4 mr-1" />
              {memberCount}
            </Button>
          ) : undefined
        }
      />

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="text-sm text-muted-foreground">불러오는 중...</div>
          </div>
        )}

        {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => {
          const date = parseISO(dateKey)
          return (
            <div key={dateKey}>
              <ChatDateDivider date={date} />
              {dateMessages.map((message, index) => {
                const prevMessage = dateMessages[index - 1]
                const showAvatar =
                  !prevMessage ||
                  prevMessage.memberId !== message.memberId ||
                  message.messageType === 'system'
                const showSender = showAvatar && message.memberId !== Number(currentUserId)

                return (
                  <ChatMessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.memberId === Number(currentUserId)}
                    showAvatar={showAvatar}
                    showSender={showSender}
                  />
                )
              })}
            </div>
          )
        })}

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <ListState type="empty" title="메시지가 없어요" description="첫 메시지를 보내보세요" />
          </div>
        )}
      </div>

      {showScrollButton && (
        <div className="absolute bottom-20 right-4 z-10">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full shadow-lg"
            onClick={() => scrollToBottom(true)}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      )}

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
