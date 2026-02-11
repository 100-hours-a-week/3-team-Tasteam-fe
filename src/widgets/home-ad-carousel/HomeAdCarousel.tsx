import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
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

  const resetAutoSlide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

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
    onBannerClick?.(banner, index)
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
  }, [currentIndex, isPaused, banners.length, autoSlideInterval])

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
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="min-w-full h-full flex-shrink-0 cursor-pointer"
              onClick={() => handleBannerClick(banner, index)}
              style={{ backgroundColor: banner.bgColor ?? undefined }}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title ?? `Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToSlide((currentIndex - 1 + banners.length) % banners.length)
              }}
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToSlide((currentIndex + 1) % banners.length)
              }}
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {banners.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                currentIndex === index ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30',
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
