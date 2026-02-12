const DEVICE_ID_STORAGE_KEY = 'device:id:v1'

const generateDeviceId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `device-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

export const getOrCreateDeviceId = () => {
  try {
    const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY)
    if (existing) return existing
    const deviceId = generateDeviceId()
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId)
    return deviceId
  } catch {
    return null
  }
}
