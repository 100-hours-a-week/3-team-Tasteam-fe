import { Image as ImageIcon } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'
import { SubgroupList } from './SubgroupList'

export type SubgroupListItem = {
  id: string
  name: string
  memberCount: number
}

export type GroupListItem = {
  id: string
  name: string
  description?: string
  memberCount: number
  subgroups: SubgroupListItem[]
}

type GroupListCardProps = {
  group: GroupListItem
  onGroupClick?: (id: string) => void
  onSubgroupClick?: (groupId: string, subgroupId: string) => void
  className?: string
}

export function GroupListCard({
  group,
  onGroupClick,
  onSubgroupClick,
  className,
}: GroupListCardProps) {
  return (
    <Card className={cn('p-0 gap-0 overflow-hidden border-[0.5px] border-border', className)}>
      <button
        type="button"
        className="group w-full text-left p-4 flex items-start gap-4 transition-colors hover:bg-muted/60 active:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onGroupClick?.(group.id)}
        aria-label={`${group.name} 그룹으로 이동`}
      >
        <div className="h-16 w-16 rounded-2xl border border-border bg-muted flex items-center justify-center overflow-hidden">
          <div className="transition-transform duration-200 ease-out group-hover:scale-[1.03]">
            <ImageIcon className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold">{group.name}</h2>
              {group.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {group.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">그룹원 {group.memberCount}명</p>
            </div>
          </div>
        </div>
      </button>

      <div className="bg-muted/60 px-4 py-4">
        <SubgroupList
          subgroups={group.subgroups}
          onSubgroupClick={(subgroupId) => onSubgroupClick?.(group.id, subgroupId)}
        />
      </div>
    </Card>
  )
}
