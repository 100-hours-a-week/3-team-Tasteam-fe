import { API_BASE_URL } from '@/shared/config/env'
import { API_ENDPOINTS } from '@/shared/config/routes'
import { getAccessToken } from '@/shared/lib/authToken'
import type { ActivityEventsIngestRequest } from '../model/types'

type SendEventsResult =
  | { ok: true }
  | {
      ok: false
      retryable: boolean
      status: number
      code?: string
    }

const resolveEndpoint = () => {
  if (!API_BASE_URL) {
    return API_ENDPOINTS.analyticsEvents
  }
  return new URL(API_ENDPOINTS.analyticsEvents, API_BASE_URL).toString()
}

const isRetryableStatus = (status: number) => status === 429 || status >= 500 || status === 0

const parseCodeSafely = async (response: Response) => {
  try {
    const payload = (await response.json()) as { code?: string }
    return payload.code
  } catch {
    return undefined
  }
}

export const sendUserActivityEvents = async (
  payload: ActivityEventsIngestRequest,
  options?: { keepalive?: boolean },
): Promise<SendEventsResult> => {
  try {
    const token = getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(resolveEndpoint(), {
      method: 'POST',
      credentials: 'include',
      keepalive: options?.keepalive ?? false,
      headers,
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      return { ok: true }
    }

    const code = await parseCodeSafely(response)
    return {
      ok: false,
      retryable: isRetryableStatus(response.status),
      status: response.status,
      code,
    }
  } catch {
    const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine
    return {
      ok: false,
      retryable: !isOnline,
      status: 0,
      code: isOnline ? 'CLIENT_TRANSPORT_BLOCKED' : 'CLIENT_OFFLINE',
    }
  }
}
