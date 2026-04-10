import { useCallback, useMemo, useState } from 'react'
import { LocationContext } from './locationContext'
import type { AppLocation, LocationStatus } from './types'
import { getCurrentPosition, setLocationPermission } from '@/shared/lib/geolocation'
import {
  DEFAULT_APP_LOCATION,
  FIXED_APP_LOCATION,
  IS_FIXED_LOCATION_ENABLED,
} from '@/shared/config/env'
import { reverseGeocodeNominatim } from '../api/reverseGeocode'

const STORAGE_KEY = 'app_location_v1'
const DEFAULT_LOCATION: Omit<AppLocation, 'updatedAt' | 'source'> = DEFAULT_APP_LOCATION

const createLocation = (
  base: Omit<AppLocation, 'updatedAt' | 'source'>,
  source: AppLocation['source'],
): AppLocation => ({
  ...base,
  updatedAt: new Date().toISOString(),
  source,
})

function loadFromStorage(): AppLocation | null {
  if (FIXED_APP_LOCATION) {
    return createLocation(FIXED_APP_LOCATION, 'manual')
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AppLocation) : null
  } catch {
    return null
  }
}

function saveToStorage(location: AppLocation) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<LocationStatus>(() => (loadFromStorage() ? 'ready' : 'idle'))
  const [location, setLocation] = useState<AppLocation | null>(() => {
    const stored = loadFromStorage()
    if (stored) return stored
    return createLocation(DEFAULT_LOCATION, 'manual')
  })
  const [error, setError] = useState<string | null>(null)

  const setManualLocation = useCallback((next: Omit<AppLocation, 'source' | 'updatedAt'>) => {
    const value = createLocation(FIXED_APP_LOCATION ?? next, 'manual')
    setLocation(value)
    saveToStorage(value)
    setError(null)
    setStatus('ready')
  }, [])

  const clearLocation = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setLocation(createLocation(DEFAULT_LOCATION, 'manual'))
    setError(null)
    setStatus(IS_FIXED_LOCATION_ENABLED ? 'ready' : 'idle')
  }, [])

  const requestCurrentLocation = useCallback(async (): Promise<AppLocation | null> => {
    setStatus('loading')
    setError(null)

    if (FIXED_APP_LOCATION) {
      const value = createLocation(FIXED_APP_LOCATION, 'manual')
      setLocation(value)
      saveToStorage(value)
      setStatus('ready')
      return value
    }

    const coords = await getCurrentPosition()
    if (!coords) {
      setLocationPermission(false)
      setStatus('error')
      setError('위치 정보를 가져올 수 없습니다.')
      return null
    }

    setLocationPermission(true)

    try {
      const resolved = await reverseGeocodeNominatim({
        latitude: coords.latitude,
        longitude: coords.longitude,
      })
      const value = createLocation(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          district: resolved.district,
          address: resolved.address,
        },
        'geolocation',
      )
      setLocation(value)
      saveToStorage(value)
      setStatus('ready')
      return value
    } catch {
      setStatus('error')
      setError('주소 정보를 확인할 수 없습니다.')
      setLocation((prev) => {
        const next = prev ?? createLocation(DEFAULT_LOCATION, 'manual')
        saveToStorage(next)
        return next
      })
      return null
    }
  }, [])

  const value = useMemo(
    () => ({
      status,
      location,
      error,
      requestCurrentLocation,
      setManualLocation,
      clearLocation,
    }),
    [clearLocation, error, location, requestCurrentLocation, setManualLocation, status],
  )

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}
