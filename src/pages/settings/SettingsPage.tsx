import { useState } from 'react'
import { ChevronRight, Bell, MapPin, Moon, Globe, Shield, HelpCircle, Info } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Card } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'

type SettingsPageProps = {
  onBack?: () => void
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: true,
    darkMode: false,
    marketingEmails: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="pb-6 min-h-screen">
      <TopAppBar title="설정" showBackButton onBack={onBack} />

      <Container className="pt-6 space-y-6">
        <section className="space-y-3">
          <h2 className="px-1 font-semibold">알림</h2>
          <Card className="divide-y">
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="notifications" className="cursor-pointer">
                    푸시 알림
                  </Label>
                  <p className="text-sm text-muted-foreground">새로운 활동 알림 받기</p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => handleToggle('notifications')}
              />
            </div>

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="marketing" className="cursor-pointer">
                  마케팅 알림
                </Label>
                <p className="text-sm text-muted-foreground">이벤트 및 프로모션 정보</p>
              </div>
              <Switch
                id="marketing"
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggle('marketingEmails')}
              />
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="px-1 font-semibold">개인정보 및 권한</h2>
          <Card className="divide-y">
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="location" className="cursor-pointer">
                    위치 서비스
                  </Label>
                  <p className="text-sm text-muted-foreground">주변 맛집 추천</p>
                </div>
              </div>
              <Switch
                id="location"
                checked={settings.locationServices}
                onCheckedChange={() => handleToggle('locationServices')}
              />
            </div>

            <button className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>개인정보 관리</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="px-1 font-semibold">화면 설정</h2>
          <Card className="divide-y">
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="darkMode" className="cursor-pointer">
                  다크 모드
                </Label>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>

            <button className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span>언어</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">한국어</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="px-1 font-semibold">지원 및 정보</h2>
          <Card className="divide-y">
            <button className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span>고객 지원</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <button className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-muted-foreground" />
                <span>앱 정보</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">v1.0.0</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          </Card>
        </section>

        <section className="space-y-3">
          <Card className="border-destructive/50">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full p-4 text-destructive hover:bg-destructive/10 transition-colors">
                  회원 탈퇴
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                    탈퇴하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </section>
      </Container>
    </div>
  )
}
