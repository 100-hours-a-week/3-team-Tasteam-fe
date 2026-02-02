import { createContext } from 'react'
import type { AppLocation, LocationStatus } from './types'

export type LocationContextValue = {
  status: LocationStatus
  location: AppLocation | null
  error: string | null
  requestCurrentLocation: () => Promise<AppLocation | null>
  setManualLocation: (location: Omit<AppLocation, 'source' | 'updatedAt'>) => void
  clearLocation: () => void
}

export const LocationContext = createContext<LocationContextValue | null>(null)
