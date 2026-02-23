import { useEffect, useState } from 'react'

/**
 * 초기 짧은 시간 동안만 스켈레톤을 노출하고, 지연 시 안내 UI로 전환하기 위한 게이트 훅
 */
export function useLoadingSkeletonGate(isLoading: boolean, timeoutMs = 1200) {
  const [showSkeleton, setShowSkeleton] = useState(isLoading)

  useEffect(() => {
    const timers: number[] = []

    if (!isLoading) {
      timers.push(
        window.setTimeout(() => {
          setShowSkeleton(false)
        }, 0),
      )
      return () => {
        timers.forEach((timer) => window.clearTimeout(timer))
      }
    }

    timers.push(
      window.setTimeout(() => {
        setShowSkeleton(true)
      }, 0),
    )
    timers.push(
      window.setTimeout(() => {
        setShowSkeleton(false)
      }, timeoutMs),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [isLoading, timeoutMs])

  return showSkeleton
}
