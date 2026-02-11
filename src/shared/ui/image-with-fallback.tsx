import type { ImgHTMLAttributes } from 'react'
import { useState } from 'react'
import { cn } from '@/shared/lib/utils'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
  progressive?: boolean
  placeholderClassName?: string
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const { src, alt, style, className, progressive = false, placeholderClassName, ...rest } = props
  const normalizedSrc = typeof src === 'string' ? src : undefined
  const didError = Boolean(normalizedSrc && failedSrc === normalizedSrc)

  const handleError = () => {
    if (normalizedSrc) {
      setFailedSrc(normalizedSrc)
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  if (didError || !src) {
    return (
      <div
        className={cn('inline-block bg-gray-100 text-center align-middle', className)}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={ERROR_IMG_SRC}
            alt={didError ? 'Error loading image' : 'No image'}
            {...rest}
            data-original-url={src}
          />
        </div>
      </div>
    )
  }

  if (progressive) {
    return (
      <div className={cn('relative overflow-hidden', className)} style={style}>
        <div
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500',
            placeholderClassName,
            isLoaded ? 'opacity-0' : 'opacity-100',
          )}
        />
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-all duration-500',
            isLoaded ? 'opacity-100 blur-0 visible' : 'opacity-0 blur-sm invisible',
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...rest}
        />
      </div>
    )
  }

  return (
    <img src={src} alt={alt} className={className} style={style} onError={handleError} {...rest} />
  )
}
