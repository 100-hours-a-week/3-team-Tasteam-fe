import type { IsoDateTimeString } from '@/shared/types/common'

export type AppLocation = {
  latitude: number
  longitude: number
  district: string
  address: string
  updatedAt: IsoDateTimeString
  source: 'geolocation' | 'manual'
}

export type LocationStatus = 'idle' | 'loading' | 'ready' | 'error'
