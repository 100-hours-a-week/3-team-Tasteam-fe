import { MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'
import type { GroupMemberDto } from '../model/dto'

type MemberRowProps = {
  member: GroupMemberDto
  role?: string
  isAdmin?: boolean
  showActions?: boolean
  onActionClick?: () => void
  className?: string
}

export function MemberRow({
  member,
  role,
  isAdmin = false,
  showActions = false,
  onActionClick,
  className,
}: MemberRowProps) {
  return (
    <div className={cn('flex items-center gap-3 py-3', className)}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={member.profileImage} alt={member.nickname} />
        <AvatarFallback>{member.nickname.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-medium">{member.nickname}</h4>
          {isAdmin && (
            <Badge variant="secondary" className="text-xs">
              관리자
            </Badge>
          )}
        </div>
        {role && <p className="text-sm text-muted-foreground truncate">{role}</p>}
      </div>

      {showActions && (
        <Button variant="ghost" size="icon" onClick={onActionClick} aria-label="멤버 옵션">
          <MoreVertical className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
