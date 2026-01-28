import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Card, CardContent } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'

type GroupEmailJoinGroupInfoProps = {
  name: string
  imageUrl?: string
  className?: string
}

export function GroupEmailJoinGroupInfo({
  name,
  imageUrl,
  className,
}: GroupEmailJoinGroupInfoProps) {
  return (
    <Card className={cn('border-border/60', className)}>
      <CardContent className="flex items-center gap-4 py-4">
        <Avatar className="h-16 w-16 border border-border">
          {imageUrl ? <AvatarImage src={imageUrl} alt={`${name} 그룹 대표 이미지`} /> : null}
          <AvatarFallback className="text-base">{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">그룹 이메일 인증 가입</p>
          <h2 className="text-lg font-semibold truncate">{name}</h2>
        </div>
      </CardContent>
    </Card>
  )
}
