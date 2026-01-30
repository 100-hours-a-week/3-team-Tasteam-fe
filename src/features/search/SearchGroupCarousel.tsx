import { useCallback, useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/shared/ui/carousel'
import { SearchGroupCard } from '@/entities/group/ui/SearchGroupCard'
import type { SearchGroupItem } from '@/entities/search/model/types'
import { cn } from '@/shared/lib/utils'

type SearchGroupCarouselProps = {
  groups: SearchGroupItem[]
  onGroupClick?: (groupId: string) => void
}

const CARDS_PER_PAGE = 8
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function SearchGroupCarousel({ groups, onGroupClick }: SearchGroupCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentPage, setCurrentPage] = useState(0)

  const pages = chunkArray(groups, CARDS_PER_PAGE)
  const totalPages = pages.length

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrentPage(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  if (groups.length === 0) return null

  return (
    <div>
      <Carousel setApi={setApi} opts={{ align: 'start' }}>
        <CarouselContent className="ml-0">
          {pages.map((page, pageIdx) => (
            <CarouselItem key={pageIdx} className="pl-0">
              <div className="grid grid-cols-4 gap-3 px-4">
                {page.map((group) => (
                  <SearchGroupCard
                    key={group.groupId}
                    groupId={group.groupId}
                    name={group.name}
                    logoImage={group.logoImage}
                    onClick={() => onGroupClick?.(String(group.groupId))}
                  />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => (
            <span
              key={idx}
              className={cn(
                'inline-block w-2 h-2 rounded-full transition-colors',
                idx === currentPage ? 'bg-gray-800' : 'bg-gray-300',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
