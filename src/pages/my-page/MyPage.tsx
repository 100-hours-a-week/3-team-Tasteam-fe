import { ChevronRight, Heart, FileText, Bell, Settings, HelpCircle, LogOut } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Separator } from '@/shared/ui/separator'

type MyPageProps = {
  user?: {
    nickname: string
    email: string
    profileImageUrl?: string
    reviewCount: number
    favoriteCount: number
  }
  onEditProfile?: () => void
  onMyFavorites?: () => void
  onMyReviews?: () => void
  onNotificationSettings?: () => void
  onSettings?: () => void
  onHelp?: () => void
  onLogout?: () => void
}

export function MyPage({
  user = {
    nickname: '사용자',
    email: 'user@example.com',
    reviewCount: 0,
    favoriteCount: 0,
  },
  onEditProfile,
  onMyFavorites,
  onMyReviews,
  onNotificationSettings,
  onSettings,
  onHelp,
  onLogout,
}: MyPageProps) {
  const menuItems = [
    { icon: Heart, label: '찜한 맛집', onClick: onMyFavorites, count: user.favoriteCount },
    { icon: FileText, label: '내 리뷰', onClick: onMyReviews, count: user.reviewCount },
    { icon: Bell, label: '알림 설정', onClick: onNotificationSettings },
    { icon: Settings, label: '설정', onClick: onSettings },
    { icon: HelpCircle, label: '고객센터', onClick: onHelp },
  ]

  return (
    <div className="pb-20 min-h-screen bg-background">
      <TopAppBar title="마이페이지" />

      <Container className="py-6 space-y-6">
        <Card className="cursor-pointer" onClick={onEditProfile}>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
                <AvatarFallback className="text-lg">{user.nickname[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{user.nickname}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-2">
            {menuItems.map((item, index) => (
              <div key={item.label}>
                <button
                  className="w-full py-3 flex items-center justify-between hover:bg-accent transition-colors rounded-md px-2"
                  onClick={item.onClick}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count !== undefined && (
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        <button
          className="w-full py-3 text-destructive flex items-center justify-center gap-2 hover:bg-destructive/10 rounded-md transition-colors"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>로그아웃</span>
        </button>
      </Container>
    </div>
  )
}
