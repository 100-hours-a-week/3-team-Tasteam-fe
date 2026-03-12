import type { Key, ReactNode } from 'react'
import { useLayoutEffect, useState } from 'react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'

type WindowVirtualizedStackProps = {
  count: number
  estimateSize: number
  overscan?: number
  gap?: number
  getItemKey?: (index: number) => Key
  renderItem: (index: number) => ReactNode
}

export function WindowVirtualizedStack({
  count,
  estimateSize,
  overscan = 4,
  gap = 0,
  getItemKey,
  renderItem,
}: WindowVirtualizedStackProps) {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
  const [scrollMargin, setScrollMargin] = useState(0)

  useLayoutEffect(() => {
    if (!containerElement) return

    const updateScrollMargin = () => {
      setScrollMargin(containerElement.offsetTop)
    }

    updateScrollMargin()
    window.addEventListener('resize', updateScrollMargin)

    return () => {
      window.removeEventListener('resize', updateScrollMargin)
    }
  }, [containerElement])

  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey,
    scrollMargin,
  })

  return (
    <div ref={setContainerElement}>
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start - scrollMargin}px)`,
            }}
          >
            <div
              style={
                gap > 0 && virtualItem.index < count - 1 ? { paddingBottom: `${gap}px` } : undefined
              }
            >
              {renderItem(virtualItem.index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
