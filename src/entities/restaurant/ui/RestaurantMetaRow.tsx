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
      // RestaurantMetaRow 컴포넌트에서
      className={cn(
        'flex items-start gap-3 px-4 py-4',
        onClick && 'hover:bg-accent transition-colors cursor-pointer',
        className,
      )}
    >
      <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-1.5" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground leading-none">{label}</p>
        <p className="text-sm break-words leading-tight mt-1">{value}</p>
      </div>
    </Component>
  )
}
