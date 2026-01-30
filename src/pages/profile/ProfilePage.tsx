import { useEffect, useState } from 'react'
import { ChevronRight, Heart, Bell, Settings, LogOut, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/widgets/container'
import { Card } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { useAuth } from '@/entities/user/model/useAuth'
import { getMe } from '@/entities/member/api/memberApi'
import type { MemberProfileDto } from '@/entities/member/model/dto'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'

type ProfilePageProps = {
  onSettingsClick?: () => void
  onLogout?: () => void
  onEditProfile?: () => void
  onNotifications?: () => void
  onNotificationSettings?: () => void
  onMyFavorites?: () => void
  onMyReviews?: () => void
}

export function ProfilePage({
  onSettingsClick,
  onLogout,
  onEditProfile,
  onNotifications,
  onNotificationSettings,
  onMyFavorites,
  onMyReviews,
}: ProfilePageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [member, setMember] = useState<MemberProfileDto | null>(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    getMe()
      .then((data) => {
        if (data.data?.member) {
          setMember(data.data.member)
        }
      })
      .catch(() => {})
  }, [isAuthenticated, location.key])

  if (!isAuthenticated) {
    return (
      <div className="pb-20 min-h-screen bg-background">
        <TopAppBar title="프로필" />
        <Container className="flex items-center justify-center py-16">
          <div className="w-full max-w-sm text-center space-y-3">
            <h3>로그인이 필요해요</h3>
            <p className="text-sm text-muted-foreground">
              로그인하면 내 정보와 활동 내역을 확인할 수 있어요.
            </p>
            <Button className="w-full" onClick={() => navigate('/login')}>
              로그인하기
            </Button>
          </div>
        </Container>
        <BottomTabBar
          currentTab="profile"
          onTabChange={(tab: TabId) => {
            if (tab === 'home') navigate(ROUTES.home)
            else if (tab === 'search') navigate(ROUTES.search)
            else if (tab === 'groups') navigate(ROUTES.groups)
            else if (tab === 'profile') navigate(ROUTES.profile)
          }}
        />
      </div>
    )
  }

  const menuItems = [
    { label: '저장한 맛집', icon: Heart, onClick: onMyFavorites },
    { label: '내 리뷰', icon: Bell, onClick: onMyReviews },
    ...(FEATURE_FLAGS.enableNotifications
      ? [
          { label: '알림', icon: Bell, onClick: onNotifications },
          { label: '알림 설정', icon: Settings, onClick: onNotificationSettings },
        ]
      : []),
    { label: '설정', icon: Settings, onClick: onSettingsClick },
  ]

  return (
    <div className="pb-20 min-h-screen bg-background">
      <TopAppBar title="프로필" />

      {member ? (
        <>
          <Container className="pt-6 pb-6">
            <div className="p-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24">
                  {member.profileImage?.url ? (
                    <AvatarImage src={member.profileImage.url} alt={member.nickname} />
                  ) : (
                    <AvatarFallback className="flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" strokeWidth={1} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col items-center gap-2 w-full">
                  <h2 className="text-xl font-semibold mb-2.5">{member.nickname} 님</h2>
                  <Button size="sm" onClick={onEditProfile} className="w-1/2">
                    프로필 수정
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </>
      ) : (
        <Container className="pt-6 pb-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">프로필을 불러오는 중...</p>
          </Card>
        </Container>
      )}

      <Container>
        <Card className="divide-y">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            )
          })}
        </Card>
      </Container>

      <Container className="pt-6">
        <Button
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10"
          onClick={() => setLogoutDialogOpen(true)}
        >
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </Button>
      </Container>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃</AlertDialogTitle>
            <AlertDialogDescription>정말 로그아웃 하시겠어요?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onLogout}>
              로그아웃
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Container className="pt-8">
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Tasteam v1.0.0</p>
          <div className="flex items-center justify-center gap-4">
            <button className="hover:text-foreground">이용약관</button>
            <Separator orientation="vertical" className="h-3" />
            <button className="hover:text-foreground">개인정보처리방침</button>
          </div>
        </div>
      </Container>

      <BottomTabBar
        currentTab="profile"
        onTabChange={(tab: TabId) => {
          if (tab === 'home') navigate(ROUTES.home)
          else if (tab === 'search') navigate(ROUTES.search)
          else if (tab === 'groups') navigate(ROUTES.groups)
        }}
      />
    </div>
  )
}
