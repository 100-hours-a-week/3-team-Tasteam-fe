import { useState, useEffect } from 'react'
import { Bell, Users, Heart, MessageSquare, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { EmptyState } from '@/widgets/empty-state'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { getNotifications } from '@/entities/notification/api/notificationApi'

type Notification = {
  id: string
  type: 'group_invite' | 'review_like' | 'group_activity' | 'restaurant_recommendation'
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

type NotificationsPageProps = {
  onNotificationClick?: (notification: Notification) => void
  onBack?: () => void
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'group_invite',
    title: '그룹 초대',
    message: '"맛집 탐험대" 그룹에 초대되었습니다',
    timestamp: '5분 전',
    isRead: false,
  },
  {
    id: '2',
    type: 'review_like',
    title: '리뷰 좋아요',
    message: '회원님의 "한옥마을 맛집" 리뷰에 좋아요 3개가 추가되었습니다',
    timestamp: '1시간 전',
    isRead: false,
  },
  {
    id: '3',
    type: 'group_activity',
    title: '그룹 활동',
    message: '"브런치 러버스" 그룹에 새로운 맛집이 추가되었습니다',
    timestamp: '2시간 전',
    isRead: true,
  },
  {
    id: '4',
    type: 'restaurant_recommendation',
    title: '맛집 추천',
    message: '회원님 근처의 새로운 맛집을 추천합니다',
    timestamp: '1일 전',
    isRead: true,
  },
]

const mapNotificationType = (type: string): Notification['type'] => {
  const typeMap: Record<string, Notification['type']> = {
    CHAT: 'group_activity',
    GROUP: 'group_invite',
    REVIEW: 'review_like',
  }
  return typeMap[type] ?? 'restaurant_recommendation'
}

export function NotificationsPage({ onNotificationClick, onBack }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    getNotifications()
      .then((response) => {
        const apiData =
          response.data?.map((item) => ({
            id: String(item.id),
            type: mapNotificationType(item.notificationType),
            title: item.title,
            message: item.body,
            timestamp: item.createdAt,
            isRead: !!item.readAt,
          })) ?? defaultNotifications
        setNotifications(apiData)
      })
      .catch(() => setNotifications(defaultNotifications))
  }, [])

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
    onNotificationClick?.(notification)
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success('모든 알림을 읽음으로 처리했습니다')
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="알림" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 overflow-auto">
        {notifications.length > 0 ? (
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
                <div key={notification.id}>
                  <Card
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      !notification.isRead ? 'bg-accent/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="py-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-sm">{notification.title}</p>
                            {!notification.isRead && (
                              <Badge variant="default" className="h-2 w-2 p-0 rounded-full">
                                <span className="sr-only">New</span>
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < notifications.length - 1 && <Separator className="my-2" />}
                </div>
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
