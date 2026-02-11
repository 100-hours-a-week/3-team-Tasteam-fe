import { Heart, Users, Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { FavoriteTarget } from '@/entities/favorite'

type FavoriteTargetItemProps = {
  target: FavoriteTarget
  isSelected: boolean
  onToggle: () => void
}

export function FavoriteTargetItem({ target, isSelected, onToggle }: FavoriteTargetItemProps) {
  const isPersonal = target.type === 'personal'

  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full flex items-center justify-between p-4 rounded-lg border transition-all',
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            isPersonal
              ? isSelected
                ? 'bg-primary/10'
                : 'bg-muted'
              : isSelected
                ? 'bg-primary/10'
                : 'bg-muted',
          )}
        >
          {isPersonal ? (
            <Heart
              className={cn('w-5 h-5', isSelected ? 'text-primary' : 'text-muted-foreground')}
            />
          ) : (
            <Users
              className={cn('w-5 h-5', isSelected ? 'text-primary' : 'text-muted-foreground')}
            />
          )}
        </div>
        <div className="text-left">
          <p className="font-semibold text-sm">{target.name}</p>
        </div>
      </div>
      {isSelected && (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  )
}
