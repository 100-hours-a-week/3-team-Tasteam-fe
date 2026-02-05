import { cn } from '@/shared/lib/utils'

/**
 * 그룹명·하위그룹명 각각 최대 너비 + 말줄임 (그룹명 최대 40%, 하위그룹명 나머지).
 * 하위그룹 없으면 그룹명만 표시.
 */
export function GroupSubgroupLabel({
  groupName,
  subGroupName,
  className = '',
}: {
  groupName: string
  subGroupName?: string | null
  className?: string
}) {
  if (subGroupName == null || subGroupName === '') {
    return (
      <span className={cn('block min-w-0 w-full truncate', className)} title={groupName}>
        {groupName}
      </span>
    )
  }
  const fullTitle = `${groupName} > ${subGroupName}`
  return (
    <span
      className={cn('flex items-center gap-1 min-w-0 overflow-hidden', className)}
      title={fullTitle}
    >
      <span className="truncate min-w-0 max-w-[40%]" title={groupName}>
        {groupName}
      </span>
      <span className="flex-shrink-0 text-muted-foreground"> &gt; </span>
      <span className="truncate min-w-0 flex-1" title={subGroupName}>
        {subGroupName}
      </span>
    </span>
  )
}
