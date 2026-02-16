import { useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, Users } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ChatInput } from '@/widgets/chat-input'
import { ListState } from '@/widgets/list-state'
import { Button } from '@/shared/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import { ChatMessageBubble, ChatDateDivider } from '@/entities/chat'
import type { ChatMessageDto } from '@/entities/chat'

type ChatRoomMember = {
  memberId: number
  nickname: string
  profileImageUrl?: string | null
}

type ChatRoomLocationState = {
  subgroupName?: string | null
  memberCount?: number
  members?: ChatRoomMember[]
}

const MEMBER_PAGE_SIZE = 10

const createMockMessages = (
  targetRoomId: string | undefined,
  currentUserId: number,
): ChatMessageDto[] => {
  if (!targetRoomId) return []

  const now = Date.now()
  return [
    {
      id: Number(`${targetRoomId}001`),
      memberId: 2,
      memberNickname: '민지',
      memberProfileImageUrl: '',
      messageType: 'text',
      content: '안녕하세요! 하위그룹 채팅방 오픈했어요.',
      createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
    },
    {
      id: Number(`${targetRoomId}002`),
      memberId: 3,
      memberNickname: '지훈',
      memberProfileImageUrl: '',
      messageType: 'text',
      content: '오늘 저녁 후보 2곳 정리해둘게요.',
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
    },
    {
      id: Number(`${targetRoomId}003`),
      memberId: currentUserId,
      memberNickname: '나',
      memberProfileImageUrl: '',
      messageType: 'text',
      content: '좋아요, 7시쯤 투표 시작해요!',
      createdAt: new Date(now - 1000 * 60 * 20).toISOString(),
    },
  ]
}

export function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ChatRoomLocationState | null
  const currentUserId = 1
  const roomTitle = state?.subgroupName?.trim() || `하위그룹 ${roomId ?? '-'}`
  const membersFromState = state?.members ?? []
  const fallbackMembers: ChatRoomMember[] = [
    { memberId: currentUserId, nickname: '나', profileImageUrl: null },
    { memberId: 2, nickname: '민지', profileImageUrl: null },
    { memberId: 3, nickname: '지훈', profileImageUrl: null },
  ]
  const members = membersFromState.length > 0 ? membersFromState : fallbackMembers
  const memberCount = state?.memberCount ?? members.length

  const [messages, setMessages] = useState<ChatMessageDto[]>(() =>
    createMockMessages(roomId, currentUserId),
  )
  const [hasMore, setHasMore] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [visibleMemberCount, setVisibleMemberCount] = useState(MEMBER_PAGE_SIZE)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isAtBottom = useRef(true)

  const scrollToBottom = (force = false) => {
    const container = scrollAreaRef.current
    if (!container) return
    if (force || isAtBottom.current) {
      container.scrollTop = container.scrollHeight
    }
  }

  const handleScroll = () => {
    const container = scrollAreaRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const atBottom = distanceFromBottom < 80
    isAtBottom.current = atBottom
    setShowScrollButton(!atBottom)
    if (scrollTop < 100 && hasMore) {
      setHasMore(false)
    }
  }

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessageDto = {
      id: Date.now(),
      memberId: currentUserId,
      memberNickname: '',
      memberProfileImageUrl: '',
      messageType: 'text',
      content: text,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMessage])
    scrollToBottom(true)
    setShowScrollButton(false)
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

  const hasMoreMembers = visibleMemberCount < members.length
  const visibleMembers = members.slice(0, visibleMemberCount)

  const handleMembersScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasMoreMembers) return
    const target = event.currentTarget
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight
    if (distanceToBottom > 24) return
    setVisibleMemberCount((prev) => Math.min(prev + MEMBER_PAGE_SIZE, members.length))
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar
        title={roomTitle}
        showBackButton
        onBack={() => navigate(-1)}
        actions={
          <DropdownMenu
            onOpenChange={(open) => {
              if (open) setVisibleMemberCount(MEMBER_PAGE_SIZE)
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-1" />
                {memberCount}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-0">
              <div className="border-b px-3 py-2 text-sm font-semibold">{roomTitle} 멤버</div>
              <div
                className="max-h-[28rem] overflow-y-auto p-2 space-y-2"
                onScroll={handleMembersScroll}
              >
                {visibleMembers.map((member) => (
                  <div
                    key={member.memberId}
                    className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.profileImageUrl ?? undefined} />
                      <AvatarFallback>{(member.nickname || '?').slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium truncate">{member.nickname}</p>
                  </div>
                ))}
                {hasMoreMembers && (
                  <p className="px-1 py-2 text-center text-xs text-muted-foreground">
                    아래로 스크롤하면 10명씩 더 보여요
                  </p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto" onScroll={handleScroll}>
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
                    isOwn={message.memberId === currentUserId}
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
            onClick={() => {
              scrollToBottom(true)
              setShowScrollButton(false)
            }}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      )}

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
