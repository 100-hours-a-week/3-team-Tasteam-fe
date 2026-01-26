import { Users } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib/utils'

type GroupCardProps = {
  id: string
  name: string
  description?: string
  memberCount: number
  memberAvatars?: { src: string; name: string }[]
  status?: string
  onClick?: () => void
  className?: string
}

export function GroupCard({
  name,
  description,
  memberCount,
  memberAvatars = [],
  status,
  onClick,
  className,
}: GroupCardProps) {
  return (
    <Card
      className={cn('p-4 cursor-pointer transition-all hover:shadow-md', className)}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="truncate">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
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
            <div className="flex -space-x-2">
              {memberAvatars.slice(0, 3).map((member, idx) => (
                <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.src} alt={member.name} />
                  <AvatarFallback className="text-xs">{member.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{memberCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
