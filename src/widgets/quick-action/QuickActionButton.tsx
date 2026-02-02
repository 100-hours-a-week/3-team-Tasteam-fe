import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type QuickActionButtonProps = {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
}

export function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  className,
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors',
        className,
      )}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-xs text-center font-medium">{label}</span>
    </button>
  )
}
