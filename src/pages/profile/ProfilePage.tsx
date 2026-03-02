import { useState } from 'react'
import {
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  User,
  Pencil,
  Gift,
  FileText,
  Flag,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/shared/ui/container'
import { Card } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'
import { AppVersionText } from '@/shared/ui/app-version'
import { useAuth } from '@/entities/user'
import { getMe } from '@/entities/member'
import { memberKeys } from '@/entities/member/model/memberKeys'
import type { MemberProfileDto } from '@/entities/member'
import { createReport, type ReportCategory } from '@/entities/report'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'
import { AlertDialog } from '@/shared/ui/alert-dialog'
import { ConfirmAlertDialogContent } from '@/shared/ui/confirm-alert-dialog'
import { STALE_USER } from '@/shared/lib/queryConstants'
import { getApiErrorCode } from '@/shared/lib/apiError'
import { toast } from 'sonner'
import { ReportModal } from '@/features/report/ReportModal'

type ProfilePageProps = {
  onSettingsClick?: () => void
  onLogout?: () => void
  onEditProfile?: () => void
  onNotifications?: () => void
  onMyReviews?: () => void
  onNotices?: () => void
  onEvents?: () => void
}

export function ProfilePage({
  onSettingsClick,
  onLogout,
  onEditProfile,
  onNotifications,
  onMyReviews,
  onNotices,
  onEvents,
}: ProfilePageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, openLogin } = useAuth()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const { data: meData, isLoading: isMeLoading } = useQuery({
    queryKey: [...memberKeys.me(), location.key],
    queryFn: () => getMe(),
    enabled: isAuthenticated,
    staleTime: STALE_USER,
  })

  const member: MemberProfileDto | null = meData?.data?.member ?? null
  const isLoading = isAuthenticated && isMeLoading

  type ProfileMenuItem = {
    label: string
    icon: typeof Bell
    onClick?: () => void
    requiresAuth?: boolean
    tone?: 'default' | 'destructive'
    showChevron?: boolean
  }

  const menuItems: ProfileMenuItem[] = [
    { label: '공지사항', icon: Bell, onClick: onNotices },
    { label: '이벤트', icon: Gift, onClick: onEvents },
    { label: '내 리뷰', icon: FileText, onClick: onMyReviews, requiresAuth: true },
    {
      label: '신고하기',
      icon: Flag,
      onClick: () => setShowReportModal(true),
      requiresAuth: true,
    },
    ...(FEATURE_FLAGS.enableNotifications
      ? [{ label: '알림', icon: Bell, onClick: onNotifications, requiresAuth: true }]
      : []),
    { label: '설정', icon: Settings, onClick: onSettingsClick },
    ...(isAuthenticated
      ? [
          {
            label: '로그아웃',
            icon: LogOut,
            onClick: () => setLogoutDialogOpen(true),
            tone: 'destructive' as const,
            showChevron: false,
          },
        ]
      : []),
  ]

  const handleReportSubmit = async ({
    category,
    content,
  }: {
    category: ReportCategory
    content: string
  }) => {
    try {
      await createReport({ category, content })
      toast.success('신고가 접수되었습니다')
      setShowReportModal(false)
    } catch (error) {
      const code = getApiErrorCode(error)
      if (code === 'REPORT_DRAFT_EXPIRED') {
        toast.error('신고 접수가 만료되었습니다. 잠시 후 다시 시도해주세요.')
        return
      }
      toast.error('신고 접수에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

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
                  <div className="w-full flex justify-center items-center gap-2 mb-2.5">
                    <h2 className="text-xl font-semibold text-center">{member.nickname} 님</h2>
                    {onEditProfile && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={onEditProfile}
                        className="h-8 w-8 shrink-0 rounded-md border-muted-foreground/60 shadow-none"
                        aria-label="프로필 수정"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
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
            const showChevron = item.showChevron ?? true
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
                {showChevron ? <ChevronRight className="h-5 w-5 text-muted-foreground" /> : null}
              </button>
            )
          })}
        </Card>
      </Container>

      {isAuthenticated && (
        <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <ConfirmAlertDialogContent
            size="sm"
            title="로그아웃"
            description="정말 로그아웃 하시겠어요?"
            confirmText="로그아웃"
            confirmVariant="destructive"
            onConfirm={onLogout}
          />
        </AlertDialog>
      )}

      <Container className="mt-[50px]">
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>
            Tasteam <AppVersionText />
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="hover:text-foreground"
              onClick={() => navigate(ROUTES.terms)}
            >
              이용약관
            </button>
            <Separator orientation="vertical" className="h-3" />
            <button
              type="button"
              className="hover:text-foreground"
              onClick={() => navigate(ROUTES.privacyPolicy)}
            >
              개인정보처리방침
            </button>
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

      <ReportModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        onSubmit={handleReportSubmit}
        title="신고하기"
        initialCategory="OTHER"
      />
    </div>
  )
}
