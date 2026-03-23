import { useState } from 'react'
import type { MainSectionItemDto } from '@/entities/main'
import { RestaurantCard } from '@/entities/restaurant'
import { GroupCategoryFilter } from '@/features/groups'
import { Container } from '@/shared/ui/container'
import { Skeleton } from '@/shared/ui/skeleton'

type HomeCategoryRestaurantSectionProps = {
  groups: Array<{
    category: string
    title: string
    items: MainSectionItemDto[]
  }>
  isLoading?: boolean
  emptyText?: string
  onRestaurantClick?: (id: string, metadata?: { position: number; section: string }) => void
  sectionType: string
}

export function HomeCategoryRestaurantSection({
  groups,
  isLoading = false,
  emptyText = '선택한 카테고리에 해당하는 음식점이 없습니다.',
  onRestaurantClick,
  sectionType,
}: HomeCategoryRestaurantSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    groups[0]?.category ?? null,
  )
  const resolvedSelectedCategory =
    selectedCategory && groups.some((group) => group.category === selectedCategory)
      ? selectedCategory
      : (groups[0]?.category ?? null)

  const selectedGroup =
    groups.find((group) => group.category === resolvedSelectedCategory) ?? groups[0] ?? null

  return (
    <>
      {groups.length > 0 && (
        <Container className="pb-3 border-b border-border">
          <GroupCategoryFilter
            categories={groups.map((group) => group.title)}
            value={selectedGroup?.title ?? null}
            onChange={(value: string | null) => {
              const nextGroup = groups.find((group) => group.title === value)
              setSelectedCategory(nextGroup?.category ?? groups[0]?.category ?? null)
            }}
          />
        </Container>
      )}

      <Container className="mt-4 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </>
        ) : selectedGroup && selectedGroup.items.length > 0 ? (
          selectedGroup.items.map((item, index) => (
            <RestaurantCard
              key={item.restaurantId}
              name={item.name}
              foodCategories={item.foodCategories}
              category={item.category}
              distance={item.distanceMeter}
              image={item.thumbnailImageUrl}
              reviewSummary={item.reviewSummary}
              onClick={() =>
                onRestaurantClick?.(String(item.restaurantId), {
                  position: index,
                  section: `${sectionType}:${selectedGroup.category}`,
                })
              }
            />
          ))
        ) : (
          <div className="py-12 text-center text-sm text-muted-foreground">{emptyText}</div>
        )}
      </Container>
    </>
  )
}
