import { MessageCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'

type FloatingChatButtonProps = {
  onClick: () => void
  unreadCount?: number
  className?: string
}

export function FloatingChatButton({
  onClick,
  unreadCount = 0,
  className,
}: FloatingChatButtonProps) {
  return (
    <div className={cn('fixed bottom-20 right-4 z-40', 'md:bottom-6 md:right-6', className)}>
      <Button
        size="icon"
        className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        onClick={onClick}
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-6 min-w-[1.5rem] rounded-full px-1.5 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}
