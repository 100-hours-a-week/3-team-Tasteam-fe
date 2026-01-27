import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import { cn } from '@/shared/lib/utils'

type GroupCategoryFilterProps = {
  categories: string[]
  value: string | null
  onChange: (value: string | null) => void
  className?: string
}

export function GroupCategoryFilter({
  categories,
  value,
  onChange,
  className,
}: GroupCategoryFilterProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <ToggleGroup
        type="single"
        value={value ?? ''}
        onValueChange={(nextValue) => onChange(nextValue || null)}
        variant="pill"
        size="sm"
        className="flex w-max gap-1 py-1"
      >
        {categories.map((category) => (
          <ToggleGroupItem
            key={category}
            value={category}
            className={cn(
              'rounded-full px-5 h-7 border border-transparent bg-muted text-foreground',
              'hover:bg-[#FFAE42] hover:text-white',
              'data-[state=on]:bg-[#FFAE42] data-[state=on]:text-white',
            )}
          >
            {category}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
