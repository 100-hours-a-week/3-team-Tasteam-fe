import type { ImgHTMLAttributes } from 'react'
import { useMemo, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { ERROR_IMG_SRC } from './image-with-fallback'

type OptimizedImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'width' | 'height'
> & {
  src: string
  alt: string
  width: number
  height: number
  webpSrc?: string
  fallbackSrc?: string
  priority?: boolean
  pictureClassName?: string
  disableInteraction?: boolean
}

const resolveWebpSrc = (src?: string) => {
  if (!src) return null

  if (/\.webp($|\?)/i.test(src)) return src

  try {
    const url = new URL(src)
    const format = url.searchParams.get('fm') ?? url.searchParams.get('format')

    if (format?.toLowerCase() === 'webp') {
      return url.toString()
    }

    if (url.hostname.includes('images.unsplash.com')) {
      url.searchParams.set('fm', 'webp')
      return url.toString()
    }
  } catch {
    return null
  }

  return null
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  webpSrc,
  fallbackSrc,
  priority = false,
  pictureClassName,
  className,
  style,
  disableInteraction = false,
  loading,
  fetchPriority,
  decoding = 'async',
  onError: onErrorCallback,
  ...rest
}: OptimizedImageProps) {
  const [didError, setDidError] = useState(false)
  const resolvedWebpSrc = useMemo(() => resolveWebpSrc(webpSrc ?? src), [src, webpSrc])
  const interactionClassName = disableInteraction ? 'pointer-events-none select-none' : ''
  const resolvedFallbackSrc = fallbackSrc ?? ERROR_IMG_SRC

  if (!src && !didError) {
    return (
      <img
        src={resolvedFallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(className, interactionClassName)}
        style={style}
        {...rest}
      />
    )
  }

  return (
    <picture className={cn('block w-full h-full', pictureClassName)}>
      {!didError && resolvedWebpSrc ? <source srcSet={resolvedWebpSrc} type="image/webp" /> : null}
      <img
        src={didError ? resolvedFallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        draggable={!disableInteraction}
        loading={priority ? 'eager' : (loading ?? 'lazy')}
        fetchPriority={priority ? 'high' : (fetchPriority ?? 'auto')}
        decoding={decoding}
        className={cn(className, interactionClassName)}
        style={style}
        onError={(event) => {
          setDidError(true)
          onErrorCallback?.(event)
        }}
        {...rest}
      />
    </picture>
  )
}
