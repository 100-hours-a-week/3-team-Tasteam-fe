const ANONYMOUS_ID_STORAGE_KEY = 'activity:anonymous-id:v1'

const generateAnonymousId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

export const getOrCreateAnonymousId = () => {
  try {
    const existing = localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY)
    if (existing) {
      return existing
    }
    const anonymousId = generateAnonymousId()
    localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, anonymousId)
    return anonymousId
  } catch {
    return generateAnonymousId()
  }
}
