import { useState } from 'react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Card } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'

type NotificationSettingsPageProps = {
  onBack?: () => void
}

export function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    groupActivity: true,
    reviewLikes: true,
    groupInvites: true,
    restaurantRecommendations: true,
    marketingEmails: false,
    nightMode: true,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
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
                disabled={!settings.pushEnabled}
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
                disabled={!settings.pushEnabled}
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
                disabled={!settings.pushEnabled}
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
                disabled={!settings.pushEnabled}
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
                disabled={!settings.pushEnabled}
              />
            </div>
          </Card>
        </section>
      </Container>
    </div>
  )
}
