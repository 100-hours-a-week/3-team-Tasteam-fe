/* eslint-disable react-hooks/incompatible-library */

import type { Key, ReactNode, RefObject } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

type ScrollVirtualizedStackProps = {
  count: number
  estimateSize: number
  scrollRef: RefObject<HTMLElement | null>
  overscan?: number
  gap?: number
  getItemKey?: (index: number) => Key
  renderItem: (index: number) => ReactNode
}

export function ScrollVirtualizedStack({
  count,
  estimateSize,
  scrollRef,
  overscan = 4,
  gap = 0,
  getItemKey,
  renderItem,
}: ScrollVirtualizedStackProps) {
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey,
  })

  return (
    <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
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
            transform: `translateY(${virtualItem.start}px)`,
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
  )
}
