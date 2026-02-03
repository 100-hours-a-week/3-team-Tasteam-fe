import { useEffect, useRef } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import { cn } from '@/shared/lib/utils'

export type MenuCategoryOption = { id: number; name: string }

type GroupCategoryFilterPropsBase = { className?: string }

type GroupCategoryFilterProps =
  | (GroupCategoryFilterPropsBase & {
      categories: string[]
      value: string | null
      onChange: (value: string | null) => void
    })
  | (GroupCategoryFilterPropsBase & {
      categories: MenuCategoryOption[]
      value: number | null
      onChange: (id: number | null) => void
    })

function isIdMode(props: GroupCategoryFilterProps): props is GroupCategoryFilterPropsBase & {
  categories: MenuCategoryOption[]
  value: number | null
  onChange: (id: number | null) => void
} {
  return (
    props.categories.length > 0 &&
    typeof props.categories[0] === 'object' &&
    props.categories[0] !== null &&
    'id' in props.categories[0]
  )
}

export function GroupCategoryFilter(props: GroupCategoryFilterProps) {
  const { categories, className } = props
  const scrollRef = useRef<HTMLDivElement>(null)
  const idMode = isIdMode(props)

  const scrollValue = idMode ? props.value : props.value
  useEffect(() => {
    if (scrollValue == null || scrollValue === '') return
    const t = setTimeout(
      () => {
        const selected = scrollRef.current?.querySelector('[data-state="on"]')
        if (selected instanceof HTMLElement) {
          selected.scrollIntoView({ inline: 'start', block: 'nearest', behavior: 'smooth' })
        }
      },
      idMode ? 80 : 50,
    )
    return () => clearTimeout(t)
  }, [scrollValue, idMode])

  if (idMode) {
    const { value, onChange } = props
    const cats = props.categories as MenuCategoryOption[]
    return (
      <div ref={scrollRef} className={cn('overflow-x-auto overflow-y-hidden', className)}>
        <ToggleGroup
          type="single"
          value={value != null ? String(value) : ''}
          onValueChange={(nextValue) => onChange(nextValue ? Number(nextValue) : null)}
          variant="pill"
          size="default"
          className="flex w-max gap-2 py-2"
        >
          {cats.map((cat) => (
            <ToggleGroupItem
              key={cat.id}
              value={String(cat.id)}
              className={cn(
                'rounded-full px-6 h-9 text-base border border-transparent bg-muted text-foreground',
                'hover:bg-[#FFAE42] hover:text-white',
                'data-[state=on]:bg-[#FFAE42] data-[state=on]:text-white',
                'max-w-[12em] overflow-hidden text-ellipsis whitespace-nowrap',
              )}
            >
              {cat.name.length > 10 ? `${cat.name.slice(0, 10)}...` : cat.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    )
  }

  const { value, onChange } = props
  return (
    <div ref={scrollRef} className={cn('overflow-x-auto overflow-y-hidden', className)}>
      <ToggleGroup
        type="single"
        value={value ?? ''}
        onValueChange={(nextValue) => onChange(nextValue || null)}
        variant="pill"
        size="default"
        className="flex w-max gap-2 py-2"
      >
        {(categories as string[]).map((category) => (
          <ToggleGroupItem
            key={category}
            value={category}
            className={cn(
              'rounded-full px-6 h-9 text-base border border-transparent bg-muted text-foreground',
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
