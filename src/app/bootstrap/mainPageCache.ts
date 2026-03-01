import type { MainPageResponseDto } from '@/entities/main'

type CachedMainPage = {
  data: MainPageResponseDto
  latitude: number
  longitude: number
}

let cache: CachedMainPage | null = null

export const setMainPageCache = (
  data: MainPageResponseDto,
  latitude: number,
  longitude: number,
) => {
  cache = { data, latitude, longitude }
}

// 좌표가 동일 격자(4자리 floor, ~11m)면 hit → 캐시 소비 후 반환. miss 혹은 좌표 불일치 시 null 반환 후 캐시 삭제.
const COORD_EPSILON = 0.0001

export const getMainPageCache = (
  latitude: number,
  longitude: number,
): MainPageResponseDto | null => {
  if (!cache) return null
  const hit =
    Math.abs(cache.latitude - latitude) < COORD_EPSILON &&
    Math.abs(cache.longitude - longitude) < COORD_EPSILON
  const data = hit ? cache.data : null
  cache = null
  return data
}

export const clearMainPageCache = () => {
  cache = null
}
