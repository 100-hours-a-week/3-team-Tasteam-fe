import { cn } from '@/shared/lib/utils'

type OnboardingProgressDotsProps = {
  total: number
  current: number
  onDotClick?: (index: number) => void
}

export function OnboardingProgressDots({
  total,
  current,
  onDotClick,
}: OnboardingProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onDotClick?.(idx)}
          disabled={!onDotClick || idx > current}
          className={cn(
            'h-2 rounded-full transition-all',
            onDotClick && idx <= current && 'cursor-pointer hover:opacity-80',
            !onDotClick || idx > current ? 'cursor-default' : '',
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
