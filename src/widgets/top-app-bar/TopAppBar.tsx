import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'

type TopAppBarProps = {
  title?: string
  showBackButton?: boolean
  onBack?: () => void
  actions?: ReactNode
}

export function TopAppBar({ title, showBackButton = false, onBack, actions }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {title && <h1 className="truncate font-semibold">{title}</h1>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
