import { Image as ImageIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { SubgroupListItem } from './GroupListCard'

type SubgroupListProps = {
  subgroups: SubgroupListItem[]
  onSubgroupClick?: (subgroupId: string) => void
  className?: string
}

export function SubgroupList({ subgroups, onSubgroupClick, className }: SubgroupListProps) {
  if (subgroups.length === 0) {
    return (
      <div
        className={cn(
          'rounded-xl border border-dashed border-border bg-background px-4 py-3',
          className,
        )}
      >
        <p className="text-sm text-muted-foreground">아직 하위 그룹이 없습니다</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {subgroups.map((subgroup) => (
        <button
          key={subgroup.id}
          type="button"
          className="group w-full text-left bg-background rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-sm transition-shadow hover:shadow active:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onSubgroupClick?.(subgroup.id)}
          aria-label={`${subgroup.name} 하위 그룹으로 이동`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              <div className="transition-transform duration-200 ease-out group-hover:scale-[1.03]">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{subgroup.name}</p>
              <p className="text-xs text-muted-foreground mt-1">그룹원 {subgroup.memberCount}명</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
