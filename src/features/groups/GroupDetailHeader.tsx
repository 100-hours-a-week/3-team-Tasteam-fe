import { ChevronLeft, MoreVertical, UserPlus, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'
import { Container } from '@/widgets/container'

export type GroupDetailHeaderData = {
  name: string
  profileImage?: string
  addressLine: string
  addressDetail?: string
  memberCount: number
}

type GroupDetailHeaderProps = {
  group: GroupDetailHeaderData
  onBack?: () => void
  onJoin?: () => void
  onMoreAction?: (action: string) => void
  className?: string
}

export function GroupDetailHeader({
  group,
  onBack,
  onJoin,
  onMoreAction,
  className,
}: GroupDetailHeaderProps) {
  return (
    <header className={cn('bg-background', className)}>
      <Container className="pt-2 pb-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onJoin} aria-label="그룹 멤버 가입">
              <UserPlus className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="더보기 메뉴">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onMoreAction?.('info')}>
                  그룹 정보
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMoreAction?.('share')}>
                  초대 링크 공유
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
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
        </div>
      </Container>
    </header>
  )
}
