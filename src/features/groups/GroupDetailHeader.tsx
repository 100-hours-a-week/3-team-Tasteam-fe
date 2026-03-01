import { ChevronLeft, Layers, MoreVertical, UserCheck, UserPlus, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { Container } from '@/shared/ui/container'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'

export type GroupDetailHeaderData = {
  name: string
  profileImage?: string
  addressLine: string
  addressDetail?: string
  memberCount: number
}

type GroupDetailHeaderProps = {
  group: GroupDetailHeaderData
  isJoined?: boolean
  isLoading?: boolean
  onBack?: () => void
  onJoin?: () => void
  onMoreAction?: () => void
  onNotificationSettings?: () => void
  onLeaveGroup?: () => void
  showJoinGuide?: boolean
  isJoinGuideVisible?: boolean
  className?: string
}

export function GroupDetailHeader({
  group,
  isJoined = false,
  isLoading = false,
  onBack,
  onJoin,
  onMoreAction,
  onNotificationSettings,
  onLeaveGroup,
  showJoinGuide = false,
  isJoinGuideVisible = false,
  className,
}: GroupDetailHeaderProps) {
  const JoinIcon = isJoined ? UserCheck : UserPlus
  const joinLabel = isJoined ? '이미 가입한 그룹' : '그룹 멤버 가입'

  return (
    <>
      <div className="sticky top-0 z-50 bg-background">
        <Container className="pt-2 pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onJoin}
                  aria-label={joinLabel}
                  disabled={isJoined}
                >
                  <JoinIcon className="h-5 w-5" />
                </Button>
                {showJoinGuide && (
                  <>
                    <div
                      className={cn(
                        'pointer-events-none absolute inset-0 rounded-md border-[3px] border-primary transition-opacity [transition-duration:250ms]',
                        isJoinGuideVisible ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <div
                      className={cn(
                        'absolute right-0 top-full z-20 mt-2 w-44 rounded-md bg-primary px-2 py-2 shadow-sm transition-all [transition-duration:250ms]',
                        isJoinGuideVisible
                          ? 'translate-y-0 opacity-100'
                          : '-translate-y-1 opacity-0 pointer-events-none',
                      )}
                    >
                      <p className="text-[14px] leading-tight whitespace-pre-line text-center text-white">
                        그룹 멤버 추가 아이콘으로
                        {'\n'}팀원을 초대해보세요.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onMoreAction} aria-label="더보기 메뉴">
                <Layers className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="그룹 설정 더보기">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {FEATURE_FLAGS.enableNotifications && (
                    <DropdownMenuItem onClick={onNotificationSettings}>알림 설정</DropdownMenuItem>
                  )}
                  <DropdownMenuItem variant="destructive" onClick={onLeaveGroup}>
                    그룹 탈퇴
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Container>
        <div className="border-b border-border/70" aria-hidden />
      </div>

      <div className={cn('bg-background', className)}>
        <Container className="pt-4 pb-6">
          <div className="mt-6 flex items-center gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-24 w-24 rounded-full border border-border" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Avatar className="h-24 w-24 border border-border">
                  {group.profileImage ? (
                    <AvatarImage src={group.profileImage} alt={`${group.name} 프로필 이미지`} />
                  ) : null}
                  <AvatarFallback className="text-base">{group.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-lg font-semibold truncate">{group.name}</h1>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Users className="h-4 w-4" />
                      <span>{group.memberCount}</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground truncate">{group.addressLine}</p>
                    {group.addressDetail && (
                      <p className="text-sm text-muted-foreground">{group.addressDetail}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
