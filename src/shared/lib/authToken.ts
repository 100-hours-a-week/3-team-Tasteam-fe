let accessToken: string | null = null
let refreshEnabled = false
const listeners = new Set<(token: string | null) => void>()

const notify = () => {
  listeners.forEach((listener) => listener(accessToken))
}

export const getAccessToken = () => {
  return accessToken
}

export const setAccessToken = (token: string | null) => {
  accessToken = token
  notify()
}

export const clearAccessToken = () => {
  accessToken = null
  notify()
}

export const setRefreshEnabled = (enabled: boolean) => {
  refreshEnabled = enabled
}

export const getRefreshEnabled = () => {
  return refreshEnabled
}

export const subscribeAccessToken = (listener: (token: string | null) => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
