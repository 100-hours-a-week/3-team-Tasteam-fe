import type { ReactNode } from 'react'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'

type CategoryChipProps = {
  label: string
  icon?: ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function CategoryChip({
  label,
  icon,
  isActive = false,
  onClick,
  className,
}: CategoryChipProps) {
  return (
    <Badge
      variant={isActive ? 'default' : 'outline'}
      className={cn(
        'px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors whitespace-nowrap',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
        className,
      )}
      onClick={onClick}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </Badge>
  )
}
