import { cn } from '@/shared/lib/utils'

type OnboardingProgressDotsProps = {
  total: number
  current: number
}

export function OnboardingProgressDots({ total, current }: OnboardingProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <span
          key={idx}
          className={cn(
            'h-2 rounded-full transition-all',
            idx === current
              ? 'bg-primary w-8'
              : idx < current
                ? 'bg-primary/50 w-2'
                : 'bg-muted w-2',
          )}
        />
      ))}
    </div>
  )
}
