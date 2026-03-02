import { useState, useEffect, useRef, useCallback, type TouchEvent } from 'react'
import { cn } from '@/shared/lib/utils'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import type { BannerDto } from '@/entities/banner'

type HomeAdCarouselProps = {
  banners: BannerDto[]
  onBannerClick?: (banner: BannerDto, index: number) => void
  autoSlideInterval?: number
}

export function HomeAdCarousel({
  banners,
  onBannerClick,
  autoSlideInterval = 4000,
}: HomeAdCarouselProps) {
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

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPaused(true)
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 10000)
  }

  const handleBannerClick = (banner: BannerDto, index: number) => {
    if (isSwipingRef.current) {
      isSwipingRef.current = false
      return
    }
    onBannerClick?.(banner, index)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (banners.length <= 1) return
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
          ? (currentIndex + 1) % banners.length
          : (currentIndex - 1 + banners.length) % banners.length
      goToSlide(nextIndex)
    } else {
      isSwipingRef.current = false
    }

    touchStartXRef.current = null
    touchCurrentXRef.current = null
  }

  useEffect(() => {
    if (!isPaused && banners.length > 1) {
      resetAutoSlide()
      timeoutRef.current = setTimeout(() => {
        nextSlide()
      }, autoSlideInterval)
    }

    return () => {
      resetAutoSlide()
    }
  }, [currentIndex, isPaused, banners.length, autoSlideInterval, nextSlide])

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [])

  if (banners.length === 0) return null

  return (
    <div className="relative w-full">
      <div className="relative h-24 sm:h-28 overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="min-w-full h-full flex-shrink-0 cursor-pointer"
              onClick={() => handleBannerClick(banner, index)}
              style={{ backgroundColor: banner.bgColor ?? undefined }}
            >
              <ImageWithFallback
                src={banner.imageUrl}
                alt={banner.title ?? `Banner ${index + 1}`}
                className="w-full h-full object-cover"
                disableInteraction
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
              />
            </div>
          ))}
        </div>

        {banners.length > 1 && (
          <>
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-1.5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    goToSlide(index)
                  }}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    currentIndex === index ? 'w-6 bg-primary' : 'w-1.5 bg-primary/45',
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
