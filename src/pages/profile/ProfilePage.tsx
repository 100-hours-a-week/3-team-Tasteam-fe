import { ChevronRight, Heart, Users, Bell, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/widgets/container'
import { Card } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

type ProfilePageProps = {
  onSettingsClick?: () => void
  onLogout?: () => void
  onMyPage?: () => void
  onEditProfile?: () => void
  onMyFavorites?: () => void
  onMyReviews?: () => void
  onNotifications?: () => void
  onNotificationSettings?: () => void
}

export function ProfilePage({
  onSettingsClick,
  onLogout,
  onMyPage,
  onEditProfile,
  onMyFavorites,
  onMyReviews,
  onNotifications,
  onNotificationSettings,
}: ProfilePageProps) {
  const navigate = useNavigate()

  const user = {
    name: '김철수',
    email: 'chulsoo@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  }

  const stats = [
    { label: '저장한 맛집', value: 24, icon: Heart },
    { label: '내 그룹', value: 3, icon: Users },
    { label: '리뷰', value: 12, icon: Bell },
  ]

  const menuItems = [
    { label: '내 정보', icon: Users, onClick: onMyPage },
    { label: '저장한 맛집', icon: Heart, onClick: onMyFavorites },
    { label: '내 리뷰', icon: Bell, onClick: onMyReviews },
    { label: '알림', icon: Bell, onClick: onNotifications },
    { label: '알림 설정', icon: Settings, onClick: onNotificationSettings },
    { label: '설정', icon: Settings, onClick: onSettingsClick },
  ]

  return (
    <div className="pb-20">
      <TopAppBar title="프로필" />
      <Container className="pt-6 pb-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="truncate font-semibold text-lg">{user.name}</h2>
              <p className="text-sm text-muted-foreground truncate mt-1">{user.email}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={onEditProfile}>
                프로필 수정
              </Button>
            </div>
          </div>
        </Card>
      </Container>

      <Container className="pb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="p-4 text-center">
                <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            )
          })}
        </div>
      </Container>

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
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </Button>
      </Container>

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
