import { useCallback, useMemo, useState } from 'react'
import { LocationContext } from './locationContext'
import type { AppLocation, LocationStatus } from './types'
import { getCurrentPosition, setLocationPermission } from '@/shared/lib/geolocation'
import { reverseGeocodeNominatim } from '../api/reverseGeocode'

const STORAGE_KEY = 'app_location_v1'
const DEFAULT_LOCATION: Omit<AppLocation, 'updatedAt' | 'source'> = {
  // fallback: 경기도 성남시 판교역
  latitude: 37.3947,
  longitude: 127.1112,
  district: '판교역',
  address: '경기도 성남시 분당구 판교역',
}

function loadFromStorage(): AppLocation | null {
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
    return {
      ...DEFAULT_LOCATION,
      updatedAt: new Date().toISOString(),
      source: 'manual',
    }
  })
  const [error, setError] = useState<string | null>(null)

  const setManualLocation = useCallback((next: Omit<AppLocation, 'source' | 'updatedAt'>) => {
    const value: AppLocation = {
      ...next,
      updatedAt: new Date().toISOString(),
      source: 'manual',
    }
    setLocation(value)
    saveToStorage(value)
    setError(null)
    setStatus('ready')
  }, [])

  const clearLocation = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setLocation({
      ...DEFAULT_LOCATION,
      updatedAt: new Date().toISOString(),
      source: 'manual',
    })
    setError(null)
    setStatus('idle')
  }, [])

  const requestCurrentLocation = useCallback(async (): Promise<AppLocation | null> => {
    setStatus('loading')
    setError(null)

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
      const value: AppLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        district: resolved.district,
        address: resolved.address,
        updatedAt: new Date().toISOString(),
        source: 'geolocation',
      }
      setLocation(value)
      saveToStorage(value)
      setStatus('ready')
      return value
    } catch {
      const fallback: AppLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        district: '현재 위치',
        address: '현재 위치',
        updatedAt: new Date().toISOString(),
        source: 'geolocation',
      }
      setLocation(fallback)
      saveToStorage(fallback)
      setStatus('error')
      setError('주소 정보를 확인할 수 없습니다.')
      return fallback
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
