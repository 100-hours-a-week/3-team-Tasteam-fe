import { useState } from 'react'
import { ChevronRight, MapPin, Moon, Globe, Shield, HelpCircle, Info } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { Card } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/label'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'
import { deleteMe } from '@/entities/member'
import { useAuth } from '@/entities/user'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { logout } = useAuth()
  const settingsInteractionsEnabled = FEATURE_FLAGS.enableSettingsInteractions
  const [settings, setSettings] = useState({
    locationServices: true,
    darkMode: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    if (!settingsInteractionsEnabled) return
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="pb-6 min-h-screen">
      <TopAppBar title="설정" showBackButton onBack={onBack} />

      <Container className="pt-6 space-y-6">
        {!settingsInteractionsEnabled && (
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              현재 일부 설정 기능은 준비 중이라 변경할 수 없습니다.
            </p>
          </Card>
        )}

        <section className="space-y-3">
          <h2 className="px-1 font-semibold">개인정보 및 권한</h2>
          <Card className="divide-y">
            <div
              className={cn(
                'p-4 flex items-center justify-between gap-3',
                !settingsInteractionsEnabled && 'opacity-50',
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label
                    htmlFor="location"
                    className={cn(settingsInteractionsEnabled ? 'cursor-pointer' : 'opacity-70')}
                  >
                    위치 서비스
                  </Label>
                  <p className="text-sm text-muted-foreground">주변 맛집 추천</p>
                </div>
              </div>
              <Switch
                id="location"
                checked={settings.locationServices}
                onCheckedChange={() => handleToggle('locationServices')}
                disabled={!settingsInteractionsEnabled}
              />
            </div>

            <button
              className={cn(
                'w-full p-4 flex items-center justify-between transition-colors',
                settingsInteractionsEnabled ? 'hover:bg-accent' : 'opacity-50 cursor-not-allowed',
              )}
              disabled={!settingsInteractionsEnabled}
              aria-disabled={!settingsInteractionsEnabled}
            >
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
            <div
              className={cn(
                'p-4 flex items-center justify-between gap-3',
                !settingsInteractionsEnabled && 'opacity-50',
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <Label
                  htmlFor="darkMode"
                  className={cn(settingsInteractionsEnabled ? 'cursor-pointer' : 'opacity-70')}
                >
                  다크 모드
                </Label>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
                disabled={!settingsInteractionsEnabled}
              />
            </div>

            <button
              className={cn(
                'w-full p-4 flex items-center justify-between transition-colors',
                settingsInteractionsEnabled ? 'hover:bg-accent' : 'opacity-50 cursor-not-allowed',
              )}
              disabled={!settingsInteractionsEnabled}
              aria-disabled={!settingsInteractionsEnabled}
            >
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
            <button
              className={cn(
                'w-full p-4 flex items-center justify-between transition-colors',
                settingsInteractionsEnabled ? 'hover:bg-accent' : 'opacity-50 cursor-not-allowed',
              )}
              disabled={!settingsInteractionsEnabled}
              aria-disabled={!settingsInteractionsEnabled}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span>고객 지원</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <button
              className={cn(
                'w-full p-4 flex items-center justify-between transition-colors',
                settingsInteractionsEnabled ? 'hover:bg-accent' : 'opacity-50 cursor-not-allowed',
              )}
              disabled={!settingsInteractionsEnabled}
              aria-disabled={!settingsInteractionsEnabled}
            >
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
              >
                회원 탈퇴
              </Button>
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
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={async () => {
                    await deleteMe()
                    await logout()
                    navigate('/')
                  }}
                >
                  탈퇴하기
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </Container>
    </div>
  )
}
