import { useEffect, useState } from 'react'
import { ChevronRight, Heart, Bell, Settings, LogOut, User, Pencil } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/shared/ui/container'
import { Card } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { useAuth } from '@/entities/user'
import { getMe } from '@/entities/member'
import type { MemberProfileDto } from '@/entities/member'
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
  const { isAuthenticated, openLogin } = useAuth()
  const [member, setMember] = useState<MemberProfileDto | null>(null)
  const [profileError, setProfileError] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!isAuthenticated) {
      Promise.resolve().then(() => {
        if (!cancelled) {
          setMember(null)
          setProfileError(false)
        }
      })
      return () => {
        cancelled = true
      }
    }
    Promise.resolve().then(() => {
      if (!cancelled) {
        setMember(null)
        setProfileError(false)
      }
    })
    getMe()
      .then((data) => {
        if (cancelled) return
        const nextMember = data.data?.member ?? null
        if (nextMember) {
          setMember(nextMember)
          setProfileError(false)
          return
        }
        setMember(null)
        setProfileError(true)
      })
      .catch(() => {
        if (!cancelled) {
          setProfileError(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, location.key])

  const isLoading = isAuthenticated && member === null && !profileError

  const menuItems = [
    { label: '저장한 맛집', icon: Heart, onClick: onMyFavorites, requiresAuth: true },
    { label: '내 리뷰', icon: Bell, onClick: onMyReviews, requiresAuth: true },
    ...(FEATURE_FLAGS.enableNotifications
      ? [
          { label: '알림', icon: Bell, onClick: onNotifications, requiresAuth: true },
          {
            label: '알림 설정',
            icon: Settings,
            onClick: onNotificationSettings,
            requiresAuth: true,
          },
        ]
      : []),
    { label: '설정', icon: Settings, onClick: onSettingsClick },
    ...(isAuthenticated
      ? [
          {
            label: '로그아웃',
            icon: LogOut,
            onClick: () => setLogoutDialogOpen(true),
            tone: 'destructive' as const,
          },
        ]
      : []),
  ]

  return (
    <div className="pb-20 min-h-screen bg-background">
      <TopAppBar title="프로필" />

      <Container className="pt-6 pb-6">
        <div className="p-6 h-[200px] flex items-center justify-center relative">
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <>
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex flex-col items-center gap-2 w-full">
                  <Skeleton className="h-7 w-32 mb-2.5" />
                  <Skeleton className="h-8 w-1/2" />
                </div>
              </>
            ) : !isAuthenticated ? (
              <div className="flex flex-col items-center gap-2">
                <Button size="sm" onClick={() => navigate('/login')} className="w-[150px] mb-2.5">
                  로그인
                </Button>
                <p className="text-sm text-muted-foreground">로그인이 필요합니다.</p>
              </div>
            ) : member ? (
              <>
                {onEditProfile && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onEditProfile}
                    className="absolute right-4 top-4 rounded-md border-muted-foreground/60 shadow-none"
                    aria-label="프로필 수정"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Avatar className="w-24 h-24 ring-1 ring-muted-foreground/40">
                  {member.profileImageUrl ? (
                    <AvatarImage src={member.profileImageUrl} alt={member.nickname} />
                  ) : (
                    <AvatarFallback className="flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" strokeWidth={1} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col items-center gap-2 w-full">
                  <h2 className="text-xl font-semibold mb-2.5">{member.nickname} 님</h2>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    {member.introduction?.trim() || '자기소개를 입력해주세요.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Avatar className="w-24 h-24 ring-1 ring-muted-foreground/40">
                  <AvatarFallback className="flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" strokeWidth={1} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center gap-2 w-full">
                  <h2 className="text-xl font-semibold mb-2.5">프로필 로드 실패</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="w-[150px]"
                  >
                    다시 시도
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>

      <Container>
        <Card className="divide-y">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            const isDestructive = item.tone === 'destructive'
            const handleClick = () => {
              if (item.requiresAuth && !isAuthenticated) {
                openLogin()
                return
              }
              item.onClick?.()
            }
            return (
              <button
                key={idx}
                onClick={handleClick}
                className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 ${isDestructive ? 'text-destructive' : 'text-muted-foreground'}`}
                  />
                  <span className={isDestructive ? 'text-destructive' : undefined}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            )
          })}
        </Card>
      </Container>

      {isAuthenticated && (
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
      )}

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
          else if (tab === 'favorites') navigate(ROUTES.favorites)
          else if (tab === 'groups') navigate(ROUTES.groups)
        }}
      />
    </div>
  )
}
