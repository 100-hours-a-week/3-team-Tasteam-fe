import { request } from '@/shared/api/request'
import type { SuccessResponse } from '@/shared/types/api'

export type ReverseGeocodeResult = {
  address: string
  district: string
}

export async function reverseGeocodeNominatim(params: {
  latitude: number
  longitude: number
}): Promise<ReverseGeocodeResult> {
  const { latitude, longitude } = params
  const response = await request<SuccessResponse<ReverseGeocodeResult>>({
    method: 'GET',
    url: `/api/v1/geocode/reverse?lat=${latitude}&lon=${longitude}`,
  })
  return response.data
}
