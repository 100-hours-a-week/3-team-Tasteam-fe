import { APP_URL } from '@/shared/config/env'
import { ROUTES } from '@/shared/config/routes'

export type ShareActionResult = 'shared' | 'copied' | 'aborted'

export const createRestaurantShareUrl = (restaurantId: number | string) => {
  return `${APP_URL}${ROUTES.restaurantDetail(String(restaurantId))}`
}

export const shareRestaurantInfo = async (link: string): Promise<ShareActionResult> => {
  if (!link) {
    throw new Error('INVALID_LINK')
  }

  if ('share' in navigator) {
    try {
      await navigator.share({
        title: '식당 상세 보기',
        text: '이 식당을 확인해 보세요',
        url: link,
      })
      return 'shared'
    } catch (error) {
      if ((error as DOMException).name === 'AbortError') {
        return 'aborted'
      }
      // 공유 시트 실패 시 클립보드로 폴백
    }
  }

  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    throw new Error('SHARE_UNAVAILABLE')
  }

  await navigator.clipboard.writeText(link)
  return 'copied'
}
