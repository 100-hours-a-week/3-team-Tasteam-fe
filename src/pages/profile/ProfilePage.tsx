import { useEffect, useState } from 'react'
import { ChevronRight, Bell, Settings, LogOut, HelpCircle, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/widgets/container'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { useAuth } from '@/entities/user/model/useAuth'
import { getMe } from '@/entities/member/api/memberApi'
import { getMyFavoriteRestaurants } from '@/entities/favorite/api/favoriteApi'
import { RestaurantCard } from '@/entities/restaurant/ui'
import type { MemberMeResponseDto } from '@/entities/member/model/dto'

type ProfilePageProps = {
  onSettingsClick?: () => void
  onLogout?: () => void
  onEditProfile?: () => void
  onNotifications?: () => void
  onNotificationSettings?: () => void
  onHelp?: () => void
  onRestaurantClick?: (id: string) => void
  onReviewClick?: (id: string) => void
}

type FavoriteItem = {
  id: string
  name: string
  category: string
  imageUrl?: string
}

type ReviewItem = {
  id: string
  restaurantName: string
  content: string
}

export function ProfilePage({
  onSettingsClick,
  onLogout,
  onEditProfile,
  onNotifications,
  onNotificationSettings,
  onHelp,
  onRestaurantClick,
  onReviewClick,
}: ProfilePageProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [userData, setUserData] = useState<MemberMeResponseDto | null>(null)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  useEffect(() => {
    if (!isAuthenticated) return
    getMe()
      .then(setUserData)
      .catch(() => {})
    getMyFavoriteRestaurants()
      .then((response) => {
        const items =
          response.items?.map((item) => ({
            id: String(item.restaurantId),
            name: item.name,
            category: '맛집',
            imageUrl: item.thumbnailUrl,
          })) ?? []
        setFavorites(items)
      })
      .catch(() => {})
  }, [isAuthenticated])

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

  const member = userData?.data?.member
  const user = {
    nickname: member?.nickname ?? '사용자',
    profileImageUrl: member?.profileImageUrl ?? '',
  }

  const reviews: ReviewItem[] =
    userData?.data?.reviews?.data?.map((r) => ({
      id: String(r.id),
      restaurantName: r.restaurantName,
      content: r.reviewContent,
    })) ?? []

  const menuItems = [
    { label: '알림', icon: Bell, onClick: onNotifications },
    { label: '알림 설정', icon: Settings, onClick: onNotificationSettings },
    { label: '설정', icon: Settings, onClick: onSettingsClick },
    { label: '고객센터', icon: HelpCircle, onClick: onHelp },
  ]

  return (
    <div className="pb-20 min-h-screen bg-background">
      <TopAppBar title="프로필" />

      <Container className="pt-6 pb-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
              <AvatarFallback>{user.nickname[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="truncate font-semibold text-lg">{user.nickname}</h2>
              <Button variant="outline" size="sm" className="mt-3" onClick={onEditProfile}>
                프로필 수정
              </Button>
            </div>
          </div>
        </Card>
      </Container>

      {favorites.length > 0 && (
        <Container className="pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">최근 찜한 맛집</h3>
            <button
              className="text-sm text-muted-foreground flex items-center"
              onClick={() => navigate(ROUTES.myFavorites)}
            >
              전체보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {favorites.slice(0, 5).map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                name={restaurant.name}
                category={restaurant.category}
                imageUrl={restaurant.imageUrl}
                onClick={() => onRestaurantClick?.(restaurant.id)}
                className="min-w-[200px] max-w-[200px]"
              />
            ))}
          </div>
        </Container>
      )}

      {reviews.length > 0 && (
        <Container className="pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">최근 작성한 리뷰</h3>
            <button
              className="text-sm text-muted-foreground flex items-center"
              onClick={() => navigate(ROUTES.myReviews)}
            >
              전체보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {reviews.slice(0, 3).map((review) => (
              <Card
                key={review.id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onReviewClick?.(review.id)}
              >
                <CardContent className="py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{review.restaurantName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
