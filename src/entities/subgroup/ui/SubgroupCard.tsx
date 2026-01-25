import { Users } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib/utils'
import type { SubgroupListItemDto } from '../model/dto'

type MemberAvatar = {
  imageUrl: string
  name: string
}

type SubgroupCardProps = {
  subgroup: SubgroupListItemDto
  memberAvatars?: MemberAvatar[]
  status?: string
  onClick?: () => void
  className?: string
}

export function SubgroupCard({
  subgroup,
  memberAvatars = [],
  status,
  onClick,
  className,
}: SubgroupCardProps) {
  return (
    <Card
      className={cn('p-4 cursor-pointer transition-all hover:shadow-md', className)}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-medium">{subgroup.name}</h3>
            {subgroup.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {subgroup.description}
              </p>
            )}
          </div>
          {status && (
            <Badge variant="secondary" className="shrink-0">
              {status}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {memberAvatars.length > 0 && (
              <div className="flex -space-x-2">
                {memberAvatars.slice(0, 3).map((member, idx) => (
                  <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                    <AvatarFallback className="text-xs">{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{subgroup.memberCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
