import { request } from '@/shared/api/request'
import { API_ENDPOINTS } from '@/shared/config/routes'
import { clearAccessToken, setAccessToken, setRefreshEnabled } from '@/shared/lib/authToken'
import { getMainPage } from '@/entities/main'
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

  const [refreshResult, mainResult] = await Promise.allSettled([
    request<RefreshResponse>({
      method: 'POST',
      url: API_ENDPOINTS.tokenRefresh,
      data: { accessToken: null },
      withCredentials: true,
    }),
    getMainPage({ latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }),
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

  if (mainResult.status === 'fulfilled') {
    setMainPageCache(mainResult.value, DEFAULT_LAT, DEFAULT_LNG)
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
