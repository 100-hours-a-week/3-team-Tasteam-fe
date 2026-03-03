import { ChevronLeft, MoreVertical, UserCheck, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Skeleton } from '@/shared/ui/skeleton'
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
  onNotificationSettings?: () => void
  onLeaveGroup?: () => void
  className?: string
}

export function GroupDetailHeader({
  group,
  isJoined = false,
  isLoading = false,
  onBack,
  onNotificationSettings,
  onLeaveGroup,
  className,
}: GroupDetailHeaderProps) {
  return (
    <>
      <div className="sticky top-0 z-50 bg-background">
        <Container className="pt-2 pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-1.5">
              {isJoined && (
                <Button variant="ghost" size="icon" aria-label="가입됨" disabled>
                  <UserCheck className="h-5 w-5" />
                </Button>
              )}
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

      <div className={className ? `bg-background ${className}` : 'bg-background'}>
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
