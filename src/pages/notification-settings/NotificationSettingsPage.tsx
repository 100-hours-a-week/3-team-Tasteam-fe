import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { Card } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'
import { EmptyState } from '@/widgets/empty-state'
import { Bell } from 'lucide-react'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'
import { getNotificationPreferences, updateNotificationPreferences } from '@/entities/notification'

type NotificationChannel = 'PUSH' | 'EMAIL'
type NotificationType = 'CHAT' | 'SYSTEM' | 'NOTICE'

const TYPE_BY_SETTING = {
  groupActivity: 'CHAT',
  groupInvites: 'SYSTEM',
  restaurantRecommendations: 'NOTICE',
} as const satisfies Record<string, NotificationType>

type NotificationSettingsPageProps = {
  onBack?: () => void
}

export function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
  const notificationsEnabled = FEATURE_FLAGS.enableNotifications
  const [settings, setSettings] = useState({
    pushEnabled: true,
    groupActivity: true,
    reviewLikes: false,
    groupInvites: true,
    restaurantRecommendations: true,
    marketingEmails: false,
    nightMode: true,
  })
  const [loading, setLoading] = useState(true)

  const preferenceKey = (channel: NotificationChannel, type: NotificationType) =>
    `${channel}_${type}`

  const preferenceByKey = useMemo(() => new Map<string, boolean>(), [])

  useEffect(() => {
    if (!notificationsEnabled) return
    getNotificationPreferences()
      .then((response) => {
        preferenceByKey.clear()
        response.data?.forEach((pref) => {
          const channel = pref.channel as NotificationChannel
          const type = pref.notificationType as NotificationType
          if (channel && type) {
            preferenceByKey.set(preferenceKey(channel, type), pref.isEnabled)
          }
        })

        const pushTypes = Object.values(TYPE_BY_SETTING)
        const pushEnabled = pushTypes.every(
          (type) => preferenceByKey.get(preferenceKey('PUSH', type)) ?? true,
        )

        setSettings((prev) => ({
          ...prev,
          pushEnabled,
          groupActivity: preferenceByKey.get(preferenceKey('PUSH', 'CHAT')) ?? prev.groupActivity,
          groupInvites: preferenceByKey.get(preferenceKey('PUSH', 'SYSTEM')) ?? prev.groupInvites,
          restaurantRecommendations:
            preferenceByKey.get(preferenceKey('PUSH', 'NOTICE')) ?? prev.restaurantRecommendations,
          marketingEmails:
            preferenceByKey.get(preferenceKey('EMAIL', 'NOTICE')) ?? prev.marketingEmails,
        }))
      })
      .catch(() => {
        toast.error('알림 설정을 불러오지 못했습니다')
      })
      .finally(() => setLoading(false))
  }, [notificationsEnabled, preferenceByKey])

  const updatePreference = (
    channel: NotificationChannel,
    type: NotificationType,
    isEnabled: boolean,
  ) =>
    updateNotificationPreferences({
      notificationPreferences: [{ channel, notificationType: type, isEnabled }],
    })

  const updatePreferencesBatch = (
    items: Array<{ channel: NotificationChannel; type: NotificationType; isEnabled: boolean }>,
  ) =>
    updateNotificationPreferences({
      notificationPreferences: items.map((item) => ({
        channel: item.channel,
        notificationType: item.type,
        isEnabled: item.isEnabled,
      })),
    })

  const handleToggle = (key: keyof typeof settings) => {
    if (!notificationsEnabled) return
    if (key === 'reviewLikes' || key === 'nightMode') {
      toast.message('해당 옵션은 아직 서버 지원이 없습니다')
      return
    }

    const nextValue = !settings[key]
    setSettings((prev) => ({ ...prev, [key]: nextValue }))

    if (key === 'pushEnabled') {
      const items = Object.values(TYPE_BY_SETTING).map((type) => ({
        channel: 'PUSH' as const,
        type,
        isEnabled: nextValue,
      }))
      updatePreferencesBatch(items).catch(() => {
        toast.error('푸시 알림 설정 변경에 실패했습니다')
        setSettings((prev) => ({ ...prev, [key]: !nextValue }))
      })
      return
    }

    if (key === 'marketingEmails') {
      updatePreference('EMAIL', 'NOTICE', nextValue).catch(() => {
        toast.error('마케팅 이메일 설정 변경에 실패했습니다')
        setSettings((prev) => ({ ...prev, [key]: !nextValue }))
      })
      return
    }

    const mappedType = TYPE_BY_SETTING[key as keyof typeof TYPE_BY_SETTING]
    if (!mappedType) return
    updatePreference('PUSH', mappedType, nextValue).catch(() => {
      toast.error('알림 설정 변경에 실패했습니다')
      setSettings((prev) => ({ ...prev, [key]: !nextValue }))
    })
  }

  if (!notificationsEnabled) {
    return (
      <div className="flex flex-col h-full bg-background min-h-screen">
        <TopAppBar title="알림 설정" showBackButton onBack={onBack} />
        <Container className="flex-1 py-6 space-y-6 overflow-auto">
          <EmptyState
            icon={Bell}
            title="알림 설정이 비활성화되어 있어요"
            description="현재 서비스에서는 알림 설정을 변경할 수 없습니다."
            actionLabel={onBack ? '뒤로가기' : undefined}
            onAction={onBack}
          />
        </Container>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="알림 설정" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 space-y-6 overflow-auto">
        <section className="space-y-3">
          <h2 className="px-1 font-semibold">푸시 알림</h2>
          <Card className="divide-y">
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="pushEnabled" className="cursor-pointer">
                  푸시 알림 허용
                </Label>
                <p className="text-sm text-muted-foreground">모든 푸시 알림 수신 여부</p>
              </div>
              <Switch
                id="pushEnabled"
                checked={settings.pushEnabled}
                onCheckedChange={() => handleToggle('pushEnabled')}
                disabled={loading}
              />
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="px-1 font-semibold">알림 종류</h2>
          <Card className="divide-y">
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="groupActivity" className="cursor-pointer">
                  그룹 활동
                </Label>
                <p className="text-sm text-muted-foreground">그룹 내 새로운 활동 알림</p>
              </div>
              <Switch
                id="groupActivity"
                checked={settings.groupActivity}
                onCheckedChange={() => handleToggle('groupActivity')}
                disabled={!settings.pushEnabled || loading}
              />
            </div>

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="reviewLikes" className="cursor-pointer">
                  리뷰 좋아요
                </Label>
                <p className="text-sm text-muted-foreground">내 리뷰에 좋아요가 추가될 때</p>
              </div>
              <Switch
                id="reviewLikes"
                checked={settings.reviewLikes}
                onCheckedChange={() => handleToggle('reviewLikes')}
                disabled
              />
            </div>

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="groupInvites" className="cursor-pointer">
                  그룹 초대
                </Label>
                <p className="text-sm text-muted-foreground">새로운 그룹 초대 알림</p>
              </div>
              <Switch
                id="groupInvites"
                checked={settings.groupInvites}
                onCheckedChange={() => handleToggle('groupInvites')}
                disabled={!settings.pushEnabled || loading}
              />
            </div>

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="restaurantRecommendations" className="cursor-pointer">
                  맛집 추천
                </Label>
                <p className="text-sm text-muted-foreground">맞춤 맛집 추천 알림</p>
              </div>
              <Switch
                id="restaurantRecommendations"
                checked={settings.restaurantRecommendations}
                onCheckedChange={() => handleToggle('restaurantRecommendations')}
                disabled={!settings.pushEnabled || loading}
              />
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="px-1 font-semibold">기타</h2>
          <Card className="divide-y">
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="marketingEmails" className="cursor-pointer">
                  마케팅 이메일
                </Label>
                <p className="text-sm text-muted-foreground">이벤트 및 프로모션 정보</p>
              </div>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggle('marketingEmails')}
                disabled={loading}
              />
            </div>

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="nightMode" className="cursor-pointer">
                  야간 알림 허용
                </Label>
                <p className="text-sm text-muted-foreground">22:00 ~ 08:00 알림 수신</p>
              </div>
              <Switch
                id="nightMode"
                checked={settings.nightMode}
                onCheckedChange={() => handleToggle('nightMode')}
                disabled
              />
            </div>
          </Card>
        </section>
      </Container>
    </div>
  )
}
