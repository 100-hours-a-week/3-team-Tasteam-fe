import { request } from '@/shared/api/request'
import { API_ENDPOINTS } from '@/shared/config/routes'
import { clearAccessToken, setAccessToken, setRefreshEnabled } from '@/shared/lib/authToken'
import { registerAllMocks } from '@/shared/mock/registerMocks'
import { DUMMY_DATA } from '@/shared/config/env'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

type RefreshResponse = {
  accessToken?: string
  data?: {
    accessToken?: string
  }
}

const runBootstrapTasks = async () => {
  if (DUMMY_DATA) {
    registerAllMocks()
  }
  setRefreshEnabled(true)
  try {
    const data = await request<RefreshResponse>({
      method: 'POST',
      url: API_ENDPOINTS.tokenRefresh,
      data: { accessToken: null },
      withCredentials: true,
    })
    const token = data.accessToken ?? data.data?.accessToken
    if (token) {
      setAccessToken(token)
    }
  } catch {
    clearAccessToken()
    // refresh 실패는 무시하고 비로그인 상태로 진행
  } finally {
    setRefreshEnabled(true)
  }
}

let bootstrapPromise: Promise<void> | null = null

export const bootstrapApp = async () => {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const startedAt = Date.now()
      await runBootstrapTasks()
      const elapsed = Date.now() - startedAt
      await delay(Math.max(0, 3000 - elapsed))
    })()
  }
  await bootstrapPromise
}
