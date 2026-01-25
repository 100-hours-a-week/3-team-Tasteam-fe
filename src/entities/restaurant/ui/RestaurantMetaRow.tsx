import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type RestaurantMetaRowProps = {
  icon: LucideIcon
  label: string
  value: string
  onClick?: () => void
  className?: string
}

export function RestaurantMetaRow({
  icon: Icon,
  label,
  value,
  onClick,
  className,
}: RestaurantMetaRowProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 py-3',
        onClick && 'hover:bg-accent transition-colors cursor-pointer',
        className,
      )}
    >
      <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-0.5">{label}</p>
        <p className="break-words">{value}</p>
      </div>
    </Component>
  )
}
