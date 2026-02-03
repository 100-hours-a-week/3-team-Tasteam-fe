import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { Card, CardContent } from '@/shared/ui/card'

type OnboardingStepPanelProps = {
  icon: LucideIcon
  title: string
  description: string
  highlights?: string[]
  children?: ReactNode
  className?: string
  titleClassName?: string
  highlightListClassName?: string
  highlightItemClassName?: string
  highlightIcon?: LucideIcon
}

export function OnboardingStepPanel({
  icon: Icon,
  title,
  description,
  highlights,
  children,
  className,
  titleClassName,
  highlightListClassName,
  highlightItemClassName,
  highlightIcon: HighlightIcon,
}: OnboardingStepPanelProps) {
  return (
    <Card className={cn('border-0 bg-card/70 py-8 shadow-none', className)}>
      <CardContent className="space-y-6 px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h1 className={cn('mb-2 text-xl font-bold whitespace-pre-line', titleClassName)}>
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground text-base whitespace-pre-line">{description}</p>
          ) : null}
        </div>

        {highlights && highlights.length > 0 && (
          <ul className={cn('space-y-2', highlightListClassName)}>
            {highlights.map((item) => (
              <li
                key={item}
                className={cn(
                  'bg-muted text-foreground rounded-lg px-3 py-2 text-sm',
                  HighlightIcon ? 'flex items-center justify-center gap-1.5' : undefined,
                  highlightItemClassName,
                )}
              >
                {HighlightIcon ? (
                  <>
                    <HighlightIcon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-center">{item}</span>
                  </>
                ) : (
                  item
                )}
              </li>
            ))}
          </ul>
        )}

        {children}
      </CardContent>
    </Card>
  )
}
