import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Users, Heart, MessageSquare, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/widgets/empty-state'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/entities/notification'
import { extractResponseData } from '@/shared/lib/apiResponse'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'
import { useLoadingSkeletonGate } from '@/shared/lib/use-loading-skeleton-gate'
import { normalizeNotificationDeepLink } from '@/entities/notification/model/deepLink'

type Notification = {
  id: string
  type: 'group_invite' | 'review_like' | 'group_activity' | 'restaurant_recommendation'
  title: string
  message: string
  deepLink: string
  timestamp: string
  isRead: boolean
}

type NotificationsPageProps = {
  onNotificationClick?: (notification: Notification) => void
  onBack?: () => void
}

const mapNotificationType = (type: string): Notification['type'] => {
  const typeMap: Record<string, Notification['type']> = {
    CHAT: 'group_activity',
    GROUP: 'group_invite',
    REVIEW: 'review_like',
  }
  return typeMap[type] ?? 'restaurant_recommendation'
}

export function NotificationsPage({ onNotificationClick, onBack }: NotificationsPageProps) {
  const navigate = useNavigate()
  const notificationsEnabled = FEATURE_FLAGS.enableNotifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(notificationsEnabled)
  const showLoadingSkeleton = useLoadingSkeletonGate(isLoading)

  useEffect(() => {
    if (!notificationsEnabled) return
    getNotifications({ page: 0, size: 10 })
      .then((response) => {
        const payload = extractResponseData<{
          items: Array<{
            id: number
            notificationType: string
            title: string
            body: string
            deepLink: string
            createdAt: string
            readAt: string | null
          }>
        }>(response)
        const apiData =
          payload?.items?.map((item) => ({
            id: String(item.id),
            type: mapNotificationType(item.notificationType),
            title: item.title,
            message: item.body,
            deepLink: normalizeNotificationDeepLink(item.deepLink),
            timestamp: item.createdAt,
            isRead: !!item.readAt,
          })) ?? []
        setNotifications(apiData)
      })
      .catch((error) => {
        const status = error?.response?.status
        console.log('[알림] API 에러:', { status, error })
        if (status === 401) {
          console.log('[알림] 401 에러 - 알림 없음으로 처리')
          setNotifications([])
        } else {
          console.log('[알림] 네트워크 에러 - 에러 상태 표시')
          setHasError(true)
          setNotifications([])
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [notificationsEnabled])

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    getNotifications({ page: 0, size: 10 })
      .then((response) => {
        const payload = extractResponseData<{
          items: Array<{
            id: number
            notificationType: string
            title: string
            body: string
            deepLink: string
            createdAt: string
            readAt: string | null
          }>
        }>(response)
        const apiData =
          payload?.items?.map((item) => ({
            id: String(item.id),
            type: mapNotificationType(item.notificationType),
            title: item.title,
            message: item.body,
            deepLink: normalizeNotificationDeepLink(item.deepLink),
            timestamp: item.createdAt,
            isRead: !!item.readAt,
          })) ?? []
        setNotifications(apiData)
      })
      .catch((error) => {
        const status = error?.response?.status
        console.log('[알림] API 에러:', { status, error })
        if (status === 401) {
          console.log('[알림] 401 에러 - 알림 없음으로 처리')
          setNotifications([])
        } else {
          console.log('[알림] 네트워크 에러 - 에러 상태 표시')
          setHasError(true)
          setNotifications([])
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'group_invite':
        return <Users className="w-5 h-5 text-primary" />
      case 'review_like':
        return <Heart className="w-5 h-5 text-destructive" />
      case 'group_activity':
        return <MessageSquare className="w-5 h-5 text-orange-500" />
      case 'restaurant_recommendation':
        return <Calendar className="w-5 h-5 text-primary" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    )
    void markNotificationRead(Number(notification.id)).catch(() => {
      toast.error('알림 읽음 처리에 실패했습니다')
    })
    onNotificationClick?.(notification)
    navigate(notification.deepLink)
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    void markAllNotificationsRead()
      .then(() => {
        toast.success('모든 알림을 읽음으로 처리했습니다')
      })
      .catch(() => {
        toast.error('모든 알림 읽음 처리에 실패했습니다')
      })
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (!notificationsEnabled) {
    return (
      <div className="flex flex-col h-full bg-background min-h-screen">
        <TopAppBar title="알림" showBackButton onBack={onBack} />
        <Container className="flex-1 py-6 overflow-auto">
          <EmptyState
            icon={Bell}
            title="알림 기능이 비활성화되어 있어요"
            description="현재 서비스에서는 알림을 제공하지 않습니다."
            actionLabel={onBack ? '뒤로가기' : undefined}
            onAction={onBack}
          />
        </Container>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="알림" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 overflow-auto">
        {hasError ? (
          <EmptyState
            icon={Bell}
            title="알림을 불러올 수 없습니다"
            description="네트워크 연결을 확인하고 다시 시도해주세요"
            actionLabel="다시 시도"
            onAction={handleRetry}
          />
        ) : isLoading ? (
          showLoadingSkeleton ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="알림을 불러오는 중이에요"
              description="네트워크 상태에 따라 시간이 조금 더 걸릴 수 있습니다"
            />
          )
        ) : notifications.length > 0 ? (
          <>
            {unreadCount > 0 && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">읽지 않은 알림 {unreadCount}개</p>
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  모두 읽음
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <>
                  <div
                    key={notification.id}
                    className={`flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                      !notification.isRead ? 'bg-accent/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                      {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={Bell}
            title="알림이 없어요"
            description="새로운 알림이 도착하면 여기에 표시됩니다"
          />
        )}
      </Container>
    </div>
  )
}
