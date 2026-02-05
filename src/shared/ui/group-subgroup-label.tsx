import { cn } from '@/shared/lib/utils'

/**
 * 그룹명·하위그룹명 왼쪽 정렬로 표시. 하위그룹 없으면 그룹명만 표시.
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
      <span className={cn('block min-w-0 w-full truncate text-left', className)} title={groupName}>
        {groupName}
      </span>
    )
  }
  const fullTitle = `${groupName} > ${subGroupName}`
  return (
    <span
      className={cn(
        'flex items-center justify-start gap-1 min-w-0 overflow-hidden text-left',
        className,
      )}
      title={fullTitle}
    >
      <span className="truncate min-w-0" title={groupName}>
        {groupName}
      </span>
      <span className="flex-shrink-0 text-muted-foreground">&gt;</span>
      <span className="truncate min-w-0" title={subGroupName}>
        {subGroupName}
      </span>
    </span>
  )
}
