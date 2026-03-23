import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react'
import { RestaurantCard } from '@/entities/restaurant'
import type { MainSectionItemDto } from '@/entities/main'
import { cn } from '@/shared/lib/utils'

type AutoSlidingRestaurantCarouselProps = {
  items: MainSectionItemDto[]
  section: string
  autoSlideInterval?: number
  onRestaurantClick?: (id: string, metadata?: { position: number; section: string }) => void
}

export function AutoSlidingRestaurantCarousel({
  items,
  section,
  autoSlideInterval = 4500,
  onRestaurantClick,
}: AutoSlidingRestaurantCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchCurrentXRef = useRef<number | null>(null)
  const isSwipingRef = useRef(false)

  const resetAutoSlide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const pauseAutoSlide = () => {
    setIsPaused(true)
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 10000)
  }

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index)
      if (items.length > 1) {
        pauseAutoSlide()
      }
    },
    [items.length],
  )

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const resolvedCurrentIndex =
    items.length === 0 ? 0 : currentIndex > items.length - 1 ? 0 : currentIndex

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (items.length <= 1) return
    pauseAutoSlide()
    touchStartXRef.current = event.touches[0]?.clientX ?? null
    touchCurrentXRef.current = touchStartXRef.current
    isSwipingRef.current = false
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return
    touchCurrentXRef.current = event.touches[0]?.clientX ?? null
    const delta = (touchCurrentXRef.current ?? touchStartXRef.current) - touchStartXRef.current
    if (Math.abs(delta) > 10) {
      isSwipingRef.current = true
    }
  }

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchCurrentXRef.current === null) {
      touchStartXRef.current = null
      touchCurrentXRef.current = null
      return
    }

    const swipeDistance = touchCurrentXRef.current - touchStartXRef.current
    const swipeThreshold = 40
    if (Math.abs(swipeDistance) >= swipeThreshold) {
      const nextIndex =
        swipeDistance < 0
          ? (currentIndex + 1) % items.length
          : (currentIndex - 1 + items.length) % items.length
      setCurrentIndex(nextIndex)
    } else {
      isSwipingRef.current = false
    }

    touchStartXRef.current = null
    touchCurrentXRef.current = null
  }

  useEffect(() => {
    if (!isPaused && items.length > 1) {
      resetAutoSlide()
      timeoutRef.current = setTimeout(() => {
        nextSlide()
      }, autoSlideInterval)
    }

    return () => {
      resetAutoSlide()
    }
  }, [autoSlideInterval, currentIndex, isPaused, items.length, nextSlide])

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div className="relative">
      <div className="overflow-hidden" aria-roledescription="carousel">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${resolvedCurrentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {items.map((item, index) => (
            <div key={item.restaurantId} className="min-w-full px-4">
              <RestaurantCard
                name={item.name}
                foodCategories={item.foodCategories}
                category={item.category}
                distance={item.distanceMeter}
                image={item.thumbnailImageUrl}
                reviewSummary={item.reviewSummary}
                onClick={() => {
                  if (isSwipingRef.current) {
                    isSwipingRef.current = false
                    return
                  }
                  onRestaurantClick?.(String(item.restaurantId), {
                    position: index,
                    section,
                  })
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={item.restaurantId}
              type="button"
              onClick={() => goToSlide(index)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                resolvedCurrentIndex === index ? 'w-6 bg-primary' : 'w-1.5 bg-primary/45',
              )}
              aria-label={`${index + 1}번 추천 보기`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
