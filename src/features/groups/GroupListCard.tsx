import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion'
import { SubgroupList } from './SubgroupList'

export type SubgroupListItem = {
  id: string
  name: string
  memberCount: number
  imageUrl?: string | null
}

export type GroupListItem = {
  id: string
  name: string
  description?: string
  memberCount: number
  imageUrl?: string | null
  subgroups: SubgroupListItem[]
}

type GroupListCardProps = {
  group: GroupListItem
  onGroupClick?: (id: string) => void
  onSubgroupClick?: (groupId: string, subgroupId: string) => void
  className?: string
  defaultExpanded?: boolean
  initialDisplayCount?: number
}

const DEFAULT_DISPLAY_COUNT = 5

export function GroupListCard({
  group,
  onGroupClick,
  onSubgroupClick,
  className,
  defaultExpanded = true,
  initialDisplayCount = DEFAULT_DISPLAY_COUNT,
}: GroupListCardProps) {
  const [showAll, setShowAll] = useState(false)

  const hasSubgroups = group.subgroups.length > 0
  const hasMoreSubgroups = group.subgroups.length > initialDisplayCount
  const displayedSubgroups = showAll
    ? group.subgroups
    : group.subgroups.slice(0, initialDisplayCount)
  const remainingCount = group.subgroups.length - initialDisplayCount

  return (
    <Card className={cn('p-0 gap-0 overflow-hidden border-[0.5px] border-border', className)}>
      <button
        type="button"
        className="group w-full text-left p-4 flex items-start gap-4 transition-colors hover:bg-muted/60 active:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onGroupClick?.(group.id)}
        aria-label={`${group.name} 그룹으로 이동`}
      >
        <div className="h-16 w-16 rounded-2xl border border-border bg-muted flex items-center justify-center overflow-hidden">
          {group.imageUrl ? (
            <img
              src={group.imageUrl}
              alt={`${group.name} 그룹 이미지`}
              className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="transition-transform duration-200 ease-out group-hover:scale-[1.03]">
              <ImageIcon className="h-7 w-7 text-muted-foreground" />
            </div>
          )}
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

      {hasSubgroups ? (
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultExpanded ? 'subgroups' : undefined}
        >
          <AccordionItem value="subgroups" className="border-none">
            <AccordionTrigger className="px-4 py-2 text-sm text-muted-foreground hover:no-underline hover:bg-muted/40 border-t border-border">
              하위 그룹 {group.subgroups.length}개
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <div className="bg-muted/60 px-4 py-4">
                <SubgroupList
                  subgroups={displayedSubgroups}
                  onSubgroupClick={(subgroupId) => onSubgroupClick?.(group.id, subgroupId)}
                />
                {hasMoreSubgroups && (
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-3 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {showAll ? '접기' : `더보기 (+${remainingCount}개)`}
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div className="bg-muted/60 px-4 py-4">
          <SubgroupList
            subgroups={[]}
            onSubgroupClick={(subgroupId) => onSubgroupClick?.(group.id, subgroupId)}
          />
        </div>
      )}
    </Card>
  )
}
