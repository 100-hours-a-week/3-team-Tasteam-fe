import { request } from '@/shared/api/request'
import { API_ENDPOINTS } from '@/shared/config/routes'
import { clearAccessToken, setAccessToken, setRefreshEnabled } from '@/shared/lib/authToken'
import { getMainPage } from '@/entities/main'
import { getCurrentPosition, getLocationPermission } from '@/shared/lib/geolocation'
import { setMainPageCache, clearMainPageCache } from './mainPageCache'

type RefreshResponse = {
  accessToken?: string
  data?: {
    accessToken?: string
  }
}

const DEFAULT_LAT = 37.5665
const DEFAULT_LNG = 126.978

const runBootstrapTasks = async () => {
  setRefreshEnabled(true)

  // 위치 권한이 이미 허용된 경우에만 GPS 대기, 아니면 즉시 null
  const locationPromise = getLocationPermission() ? getCurrentPosition() : Promise.resolve(null)

  // 토큰 갱신과 GPS를 병렬로 실행
  const [refreshResult, positionResult] = await Promise.allSettled([
    request<RefreshResponse>({
      method: 'POST',
      url: API_ENDPOINTS.tokenRefresh,
      data: { accessToken: null },
      withCredentials: true,
    }),
    locationPromise,
  ])

  if (refreshResult.status === 'fulfilled') {
    const token = refreshResult.value.accessToken ?? refreshResult.value.data?.accessToken
    if (token) {
      setAccessToken(token)
    } else {
      clearAccessToken()
    }
  } else {
    clearAccessToken()
  }

  // GPS 결과로 좌표 결정, 실패 시 기본값
  const position = positionResult.status === 'fulfilled' ? positionResult.value : null
  const lat = position?.latitude ?? DEFAULT_LAT
  const lng = position?.longitude ?? DEFAULT_LNG

  const mainResult = await getMainPage({ latitude: lat, longitude: lng }).catch(() => null)
  if (mainResult) {
    setMainPageCache(mainResult, lat, lng)
  } else {
    clearMainPageCache()
  }

  setRefreshEnabled(true)
}

let bootstrapPromise: Promise<void> | null = null

export const bootstrapApp = async () => {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrapTasks()
  }
  await bootstrapPromise
}
