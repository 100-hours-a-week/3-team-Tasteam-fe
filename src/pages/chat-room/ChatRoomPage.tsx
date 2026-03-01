import { useCallback, useEffect, useMemo, useRef, useState, type UIEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Client, type IMessage } from '@stomp/stompjs'
import { ChevronDown, Users } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ChatInput } from '@/widgets/chat-input'
import { ListState } from '@/widgets/list-state'
import { Button } from '@/shared/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import { extractResponseData } from '@/shared/lib/apiResponse'
import { getAccessToken } from '@/shared/lib/authToken'
import { API_BASE_URL } from '@/shared/config/env'
import {
  ChatDateDivider,
  ChatMessageBubble,
  getChatMessages,
  sendChatMessage,
  updateChatReadCursor,
} from '@/entities/chat'
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGE_SIZE_BYTES,
  MIN_IMAGE_SIZE_BYTES,
  createUploadGrant,
  uploadFileToS3,
  type UploadGrantResponseDto,
} from '@/entities/upload'
import { getSubgroupMembers } from '@/entities/subgroup'
import type { ChatMessageDto } from '@/entities/chat'

type ChatRoomMember = {
  memberId: number
  nickname: string
  profileImageUrl: string | null
}

type ChatRoomLocationState = {
  subgroupId?: number
  subgroupName?: string | null
  memberCount?: number
  members?: ChatRoomMember[]
}

const MEMBER_PAGE_SIZE = 10
const INITIAL_MESSAGE_PAGE_SIZE = 50
const MESSAGE_PAGE_SIZE = 20
const MAX_AUTO_PREFETCH_ROUNDS = 2
const EARLY_LOAD_TRIGGER_PX = 360
const WS_HEARTBEAT_MS = 15000
const WS_RECONNECT_DELAYS_MS = [3000, 5000, 10000] as const

const toWsUrl = (apiBaseUrl: string) => {
  const url = new URL(apiBaseUrl)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = '/ws/chat'
  url.search = ''
  url.hash = ''
  return url.toString()
}

const parseJwtPayload = (token: string): { sub?: string } | null => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as { sub?: string }
  } catch {
    return null
  }
}

const normalizeMessage = (message: ChatMessageDto): ChatMessageDto => ({
  ...message,
  messageType: message.messageType.toLowerCase(),
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const resolveMemberProfileImageUrl = (member: unknown): string | null => {
  if (!isRecord(member)) return null

  if (typeof member.profileImageUrl === 'string' && member.profileImageUrl.trim()) {
    return member.profileImageUrl
  }
  if (typeof member.memberProfileImageUrl === 'string' && member.memberProfileImageUrl.trim()) {
    return member.memberProfileImageUrl
  }
  if (isRecord(member.profileImage) && typeof member.profileImage.url === 'string') {
    return member.profileImage.url
  }

  return null
}

const normalizeRoomMembers = (members: unknown): ChatRoomMember[] => {
  if (!Array.isArray(members)) return []

  return members.reduce<ChatRoomMember[]>((acc, member) => {
    if (!isRecord(member)) return acc
    const memberId = Number(member.memberId)
    const nickname = typeof member.nickname === 'string' ? member.nickname : ''
    if (!Number.isFinite(memberId) || !nickname) return acc

    acc.push({
      memberId,
      nickname,
      profileImageUrl: resolveMemberProfileImageUrl(member),
    })
    return acc
  }, [])
}

export function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ChatRoomLocationState | null
  const chatRoomId = Number(roomId)
  const isValidRoomId = Number.isFinite(chatRoomId)

  const currentUserId = useMemo(() => {
    const token = getAccessToken()
    if (!token) return null
    const payload = parseJwtPayload(token)
    if (!payload) return null
    const parsedSub = Number(payload.sub)
    return Number.isFinite(parsedSub) ? parsedSub : null
  }, [])
  const ownMemberId = currentUserId ?? -1

  const roomTitle = state?.subgroupName?.trim() || `채팅방 ${roomId ?? ''}`
  const [members, setMembers] = useState<ChatRoomMember[]>(() =>
    normalizeRoomMembers(state?.members),
  )
  const [memberCount, setMemberCount] = useState<number>(state?.memberCount ?? members.length)
  const [visibleMemberCount, setVisibleMemberCount] = useState(MEMBER_PAGE_SIZE)

  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  // 서버가 nextCursor를 누락해도 hasNext=true면 추가 페이지를 시도할 수 있어야 한다.
  const [hasNext, setHasNext] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [wsErrorMessage, setWsErrorMessage] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isSendingImage, setIsSendingImage] = useState(false)
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState<number | null>(null)

  const clientRef = useRef<Client | null>(null)
  const wsReconnectAttemptRef = useRef(0)
  const wsReconnectTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const wsShuttingDownRef = useRef(false)
  const forceScrollOnNextIncomingRef = useRef(false)
  const readCursorSyncedRef = useRef<number | null>(null)
  const memberRefreshAttemptedRef = useRef(false)
  const autoPrefetchRoundsRef = useRef(0)
  const nullCursorProbeExhaustedRef = useRef(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)

  const scrollToBottom = (force = false) => {
    const container = scrollAreaRef.current
    if (!container) return
    if (force || isAtBottomRef.current) {
      container.scrollTop = container.scrollHeight
      isAtBottomRef.current = true
    }
  }

  const scrollToFirstUnreadMarker = () => {
    const container = scrollAreaRef.current
    if (!container) return false
    const marker = container.querySelector<HTMLElement>('[data-read-marker="true"]')
    if (!marker) return false

    const targetTop = Math.max(
      marker.offsetTop - Math.round((container.clientHeight - marker.offsetHeight) / 2),
      0,
    )
    container.scrollTop = targetTop
    isAtBottomRef.current = false
    setShowScrollButton(true)
    return true
  }

  useEffect(() => {
    if (!isValidRoomId) {
      setIsLoading(false)
      setErrorMessage('유효하지 않은 채팅방입니다.')
      return
    }

    let cancelled = false
    const loadInitialMessages = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const enterResponse = await getChatMessages(chatRoomId, {
          size: INITIAL_MESSAGE_PAGE_SIZE,
          mode: 'ENTER',
        })
        if (cancelled) return

        const enterMessages = enterResponse.items.map(normalizeMessage).reverse()
        const enterAfterCursor = enterResponse.pagination.afterCursor
        let newerMessages: ChatMessageDto[] = []

        if (enterAfterCursor) {
          try {
            const afterResponse = await getChatMessages(chatRoomId, {
              cursor: enterAfterCursor,
              size: INITIAL_MESSAGE_PAGE_SIZE,
              mode: 'AFTER',
            })
            if (cancelled) return
            newerMessages = afterResponse.items.map(normalizeMessage).reverse()
          } catch {
            newerMessages = []
          }
        }

        const merged = [...enterMessages, ...newerMessages]
        const uniqueById = Array.from(new Map(merged.map((item) => [item.id, item])).values())
        uniqueById.sort((a, b) => a.id - b.id)

        setMessages(uniqueById)
        setNextCursor(enterResponse.pagination.nextCursor)
        setHasNext(enterResponse.pagination.hasNext)
        setFirstUnreadMessageId(newerMessages[0]?.id ?? null)
        nullCursorProbeExhaustedRef.current = false
        autoPrefetchRoundsRef.current = 0
      } catch {
        if (!cancelled) {
          setErrorMessage('메시지를 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
          requestAnimationFrame(() => {
            if (!scrollToFirstUnreadMarker()) {
              scrollToBottom(true)
            }
          })
        }
      }
    }

    void loadInitialMessages()
    return () => {
      cancelled = true
    }
  }, [chatRoomId, isValidRoomId])

  useEffect(() => {
    memberRefreshAttemptedRef.current = false
  }, [state?.subgroupId])

  useEffect(() => {
    const subgroupId = state?.subgroupId
    if (!subgroupId) return

    const hasMissingProfile = members.some((member) => !member.profileImageUrl)
    if (members.length > 0 && !hasMissingProfile) return
    if (members.length > 0 && hasMissingProfile && memberRefreshAttemptedRef.current) return

    let cancelled = false
    const loadMembers = async () => {
      memberRefreshAttemptedRef.current = true
      try {
        const memberList = await getSubgroupMembers(subgroupId, { size: 100 })
        if (cancelled) return
        const mapped = normalizeRoomMembers(memberList)
        setMembers(mapped)
        setMemberCount(state?.memberCount ?? mapped.length)
      } catch {
        // keep fallback state
      }
    }

    void loadMembers()
    return () => {
      cancelled = true
    }
  }, [members, state?.memberCount, state?.subgroupId])

  useEffect(() => {
    if (!isValidRoomId) return
    wsShuttingDownRef.current = false
    const wsUrl = toWsUrl(API_BASE_URL)

    const clearReconnectTimer = () => {
      if (wsReconnectTimerRef.current == null) return
      clearTimeout(wsReconnectTimerRef.current)
      wsReconnectTimerRef.current = null
    }

    const scheduleReconnect = () => {
      if (wsShuttingDownRef.current) return
      if (wsReconnectTimerRef.current != null) return
      const delayIndex = Math.min(wsReconnectAttemptRef.current, WS_RECONNECT_DELAYS_MS.length - 1)
      const delay = WS_RECONNECT_DELAYS_MS[delayIndex]
      wsReconnectAttemptRef.current += 1

      wsReconnectTimerRef.current = window.setTimeout(() => {
        wsReconnectTimerRef.current = null
        connectWebSocket()
      }, delay)
    }

    const connectWebSocket = () => {
      if (wsShuttingDownRef.current) return
      const token = getAccessToken()
      if (!token) return

      const prev = clientRef.current
      if (prev) {
        clientRef.current = null
        void prev.deactivate()
      }

      const wsClient = new Client({
        brokerURL: wsUrl,
        reconnectDelay: 0,
        heartbeatIncoming: WS_HEARTBEAT_MS,
        heartbeatOutgoing: WS_HEARTBEAT_MS,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          wsReconnectAttemptRef.current = 0
          clearReconnectTimer()
          setErrorMessage(null)
          setWsErrorMessage(null)

          wsClient.subscribe(`/topic/chat-rooms/${chatRoomId}`, (frame: IMessage) => {
            try {
              const incoming = normalizeMessage(JSON.parse(frame.body) as ChatMessageDto)
              setMessages((prevMessages) => {
                if (prevMessages.some((item) => item.id === incoming.id)) return prevMessages
                const next = [...prevMessages, incoming]
                next.sort((a, b) => a.id - b.id)
                return next
              })
              requestAnimationFrame(() => {
                const shouldForceScroll =
                  forceScrollOnNextIncomingRef.current || incoming.memberId === ownMemberId
                if (shouldForceScroll) {
                  forceScrollOnNextIncomingRef.current = false
                }
                scrollToBottom(shouldForceScroll)
                if (shouldForceScroll) {
                  requestAnimationFrame(() => scrollToBottom(true))
                  setShowScrollButton(false)
                }
              })
            } catch {
              // ignore malformed payload
            }
          })
        },
        onStompError: () => {
          setWsErrorMessage('실시간 연결이 불안정합니다. 재연결을 시도합니다.')
          void wsClient.deactivate()
          scheduleReconnect()
        },
        onWebSocketError: () => {
          setWsErrorMessage('실시간 연결에 실패했습니다. 재연결을 시도합니다.')
        },
        onWebSocketClose: () => {
          if (clientRef.current !== wsClient) return
          scheduleReconnect()
        },
      })

      clientRef.current = wsClient
      wsClient.activate()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      const client = clientRef.current
      if (client?.connected) return

      wsReconnectAttemptRef.current = 0
      clearReconnectTimer()
      connectWebSocket()
    }

    connectWebSocket()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      wsShuttingDownRef.current = true
      clearReconnectTimer()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      const wsClient = clientRef.current
      clientRef.current = null
      if (wsClient) {
        void wsClient.deactivate()
      }
    }
  }, [chatRoomId, isValidRoomId, ownMemberId])

  useEffect(() => {
    if (!isValidRoomId || messages.length === 0) return
    if (!isAtBottomRef.current) return
    const lastMessageId = messages[messages.length - 1]?.id
    if (!lastMessageId || readCursorSyncedRef.current === lastMessageId) return

    readCursorSyncedRef.current = lastMessageId
    void updateChatReadCursor(chatRoomId, { lastReadMessageId: lastMessageId }).catch(() => {
      readCursorSyncedRef.current = null
    })
  }, [chatRoomId, isValidRoomId, messages])

  const loadOlderMessages = useCallback(
    async (force = false) => {
      if (!isValidRoomId || isLoadingMore) return
      // 트리거는 강제로 발생시킬 수 있게 두되, 서버가 커서를 주지 않아 같은 페이지 반복 시도는 막는다.
      if (!force && !hasNext) return
      if (nextCursor == null && nullCursorProbeExhaustedRef.current) return

      const container = scrollAreaRef.current
      const prevScrollHeight = container?.scrollHeight ?? 0
      const prevScrollTop = container?.scrollTop ?? 0

      setIsLoadingMore(true)
      try {
        // 커서가 없으면 백엔드 기본 페이징 규칙으로 다음 페이지를 재요청한다.
        const response = await getChatMessages(chatRoomId, {
          cursor: nextCursor ?? undefined,
          size: MESSAGE_PAGE_SIZE,
          mode: 'BEFORE',
        })
        const normalized = response.items.map(normalizeMessage).reverse()
        if (normalized.length === 0) {
          setNextCursor(null)
          setHasNext(false)
          nullCursorProbeExhaustedRef.current = true
          return
        }

        let addedCount = 0
        setMessages((prev) => {
          const merged = [...normalized, ...prev]
          const uniqueById = Array.from(new Map(merged.map((item) => [item.id, item])).values())
          uniqueById.sort((a, b) => a.id - b.id)
          addedCount = uniqueById.length - prev.length
          return uniqueById
        })
        setNextCursor(response.pagination.nextCursor)
        setHasNext(response.pagination.hasNext)

        // nextCursor가 계속 null이고 새 메시지가 전혀 늘지 않으면 같은 첫 페이지 반복으로 간주한다.
        if (response.pagination.nextCursor == null && addedCount <= 0) {
          nullCursorProbeExhaustedRef.current = true
          setHasNext(false)
        } else {
          nullCursorProbeExhaustedRef.current = false
        }

        requestAnimationFrame(() => {
          const node = scrollAreaRef.current
          if (!node) return
          const addedHeight = node.scrollHeight - prevScrollHeight
          node.scrollTop = prevScrollTop + addedHeight
        })
      } catch {
        // keep current timeline
      } finally {
        setIsLoadingMore(false)
      }
    },
    [chatRoomId, hasNext, isLoadingMore, isValidRoomId, nextCursor],
  )

  useEffect(() => {
    if (isLoading || isLoadingMore) return
    const container = scrollAreaRef.current
    if (!container) return

    const notScrollable = container.scrollHeight <= container.clientHeight + 1
    if (!notScrollable) return
    if (autoPrefetchRoundsRef.current >= MAX_AUTO_PREFETCH_ROUNDS) return

    autoPrefetchRoundsRef.current += 1
    if (autoPrefetchRoundsRef.current <= MAX_AUTO_PREFETCH_ROUNDS) {
      void loadOlderMessages(true)
    }
  }, [isLoading, isLoadingMore, loadOlderMessages, messages])

  useEffect(() => {
    if (isLoading) return
    const root = scrollAreaRef.current
    const target = topSentinelRef.current
    if (!root || !target || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting && !isLoadingMore) {
          void loadOlderMessages(true)
        }
      },
      { root, threshold: 0, rootMargin: '400px 0px 0px 0px' },
    )

    observer.observe(target)
    return () => {
      observer.disconnect()
    }
  }, [isLoading, isLoadingMore, loadOlderMessages])

  const handleScroll = () => {
    const container = scrollAreaRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const atBottom = distanceFromBottom < 80
    isAtBottomRef.current = atBottom
    setShowScrollButton(!atBottom)

    // 상단 인접 구간에서 미리 이전 메시지를 불러와 체감 지연을 줄인다.
    if (scrollTop <= EARLY_LOAD_TRIGGER_PX && !isLoadingMore) {
      void loadOlderMessages(true)
    }
  }

  const handleSendTextMessage = async (text: string) => {
    if (!isValidRoomId || !text.trim()) return

    const payload = {
      messageType: 'TEXT' as const,
      content: text.trim(),
    }

    const client = clientRef.current
    if (client?.connected) {
      forceScrollOnNextIncomingRef.current = true
      client.publish({
        destination: `/pub/chat-rooms/${chatRoomId}/messages`,
        body: JSON.stringify(payload),
      })
      scrollToBottom(true)
      setShowScrollButton(false)
      return
    }

    try {
      const response = await sendChatMessage(chatRoomId, payload)
      const sentMessage = extractResponseData<ChatMessageDto>(response)
      if (sentMessage) {
        const normalized = normalizeMessage(sentMessage)
        setMessages((prev) => {
          if (prev.some((item) => item.id === normalized.id)) return prev
          const next = [...prev, normalized]
          next.sort((a, b) => a.id - b.id)
          return next
        })
      }
      scrollToBottom(true)
      setShowScrollButton(false)
    } catch {
      setErrorMessage('메시지 전송에 실패했습니다.')
    }
  }

  const handleSendImageMessage = async (attachment: File, text: string) => {
    if (!isValidRoomId) return
    if (text.trim()) {
      toast.error('이미지 메시지는 텍스트 없이 전송할 수 있습니다.')
      return
    }
    if (!ALLOWED_IMAGE_TYPES.includes(attachment.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      toast.error(`지원하지 않는 이미지 형식입니다. (${ALLOWED_IMAGE_EXTENSIONS})`)
      return
    }
    if (attachment.size < MIN_IMAGE_SIZE_BYTES) {
      toast.error('파일이 비어있거나 너무 작습니다.')
      return
    }
    if (attachment.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`파일 크기는 ${MAX_IMAGE_SIZE_MB}MB 이하여야 합니다.`)
      return
    }

    setIsSendingImage(true)
    try {
      const grantResponse = await createUploadGrant({
        purpose: 'CHAT_IMAGE',
        files: [
          {
            fileName: attachment.name,
            contentType: attachment.type,
            size: attachment.size,
          },
        ],
      })
      const grantPayload = extractResponseData<UploadGrantResponseDto>(grantResponse)
      const [grant] = grantPayload?.uploads ?? []
      if (!grant) throw new Error('Upload grant is empty')

      await uploadFileToS3(grant.url, grant.fields, attachment)

      const response = await sendChatMessage(chatRoomId, {
        messageType: 'FILE',
        content: null,
        files: [{ fileUuid: grant.fileUuid }],
      })

      const sentMessage = extractResponseData<ChatMessageDto>(response)
      if (sentMessage) {
        const normalized = normalizeMessage(sentMessage)
        setMessages((prev) => {
          if (prev.some((item) => item.id === normalized.id)) return prev
          const next = [...prev, normalized]
          next.sort((a, b) => a.id - b.id)
          return next
        })
      }

      scrollToBottom(true)
      setShowScrollButton(false)
    } catch {
      toast.error('이미지 메시지 전송에 실패했습니다.')
    } finally {
      setIsSendingImage(false)
    }
  }

  const handleSendMessage = async (text: string, attachments?: File[]) => {
    if (attachments && attachments.length > 0) {
      const [firstImage] = attachments
      if (!firstImage) return
      await handleSendImageMessage(firstImage, text)
      return
    }

    await handleSendTextMessage(text)
  }

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const dateKey = format(new Date(message.createdAt), 'yyyy-MM-dd')
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(message)
      return groups
    },
    {} as Record<string, ChatMessageDto[]>,
  )

  const hasMoreMembers = visibleMemberCount < members.length
  const visibleMembers = members.slice(0, visibleMemberCount)
  const memberProfileImageById = useMemo(
    () => new Map(members.map((member) => [member.memberId, member.profileImageUrl ?? null])),
    [members],
  )

  const handleMembersScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasMoreMembers) return
    const target = event.currentTarget
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight
    if (distanceToBottom > 24) return
    setVisibleMemberCount((prev) => Math.min(prev + MEMBER_PAGE_SIZE, members.length))
  }

  return (
    <div className="relative flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-background">
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

      <div
        ref={scrollAreaRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        onScroll={handleScroll}
      >
        <div ref={topSentinelRef} className="h-1 w-full" aria-hidden />
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <ListState type="loading" />
          </div>
        ) : errorMessage && messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <ListState type="error" title="채팅을 불러오지 못했어요" description={errorMessage} />
          </div>
        ) : (
          <>
            {wsErrorMessage && (
              <div className="px-4 pt-3 text-xs text-destructive">{wsErrorMessage}</div>
            )}
            {isLoadingMore && (
              <div className="py-3 text-center text-xs text-muted-foreground">
                이전 메시지 불러오는 중...
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
                    const showSender = showAvatar && message.memberId !== ownMemberId
                    const messageWithProfile = message.memberProfileImageUrl
                      ? message
                      : {
                          ...message,
                          memberProfileImageUrl:
                            memberProfileImageById.get(message.memberId) ?? null,
                        }
                    return (
                      <div key={message.id}>
                        {firstUnreadMessageId === message.id && (
                          <div
                            data-read-marker="true"
                            className="mx-4 my-3 rounded-full border border-border bg-background px-3 py-1 text-center text-xs text-muted-foreground"
                          >
                            여기까지 읽었습니다.
                          </div>
                        )}
                        <ChatMessageBubble
                          message={messageWithProfile}
                          isOwn={message.memberId === ownMemberId}
                          showAvatar={showAvatar}
                          showSender={showSender}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <ListState
                  type="empty"
                  title="메시지가 없어요"
                  description="첫 메시지를 보내보세요"
                />
              </div>
            )}

            <div className="h-3" aria-hidden />
          </>
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

      <div className="sticky bottom-0 z-20 bg-background">
        <ChatInput
          onSendMessage={(text, attachments) => void handleSendMessage(text, attachments)}
          disabled={isSendingImage}
        />
      </div>
    </div>
  )
}
