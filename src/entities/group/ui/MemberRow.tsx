import { MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'
import type { GroupMemberDto } from '../model/dto'

type MemberDtoProps = {
  member: GroupMemberDto
  role?: string
  isAdmin?: boolean
  showActions?: boolean
  onActionClick?: () => void
  className?: string
}

type MemberSimpleProps = {
  memberId: number
  nickname: string
  profileImage: string
  role?: string
  isAdmin?: boolean
  showActions?: boolean
  onActionClick?: () => void
  className?: string
}

type MemberRowProps = MemberDtoProps | MemberSimpleProps

function isSimpleProps(props: MemberRowProps): props is MemberSimpleProps {
  return 'nickname' in props && !('member' in props)
}

export function MemberRow(props: MemberRowProps) {
  if (isSimpleProps(props)) {
    const {
      nickname,
      profileImage,
      role,
      isAdmin = false,
      showActions = false,
      onActionClick,
      className,
    } = props
    return (
      <div className={cn('flex items-center gap-3 py-3', className)}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={profileImage} alt={nickname} />
          <AvatarFallback>{nickname.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate">{nickname}</h4>
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

  const { member, role, isAdmin = false, showActions = false, onActionClick, className } = props
  return (
    <div className={cn('flex items-center gap-3 py-3', className)}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={member.profileImage.url} alt={member.nickname} />
        <AvatarFallback>{member.nickname.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="truncate">{member.nickname}</h4>
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
