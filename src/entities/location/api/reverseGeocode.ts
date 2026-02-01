type NominatimAddress = {
  city?: string
  county?: string
  borough?: string
  city_district?: string
  suburb?: string
  neighbourhood?: string
  quarter?: string
  village?: string
  town?: string
}

type NominatimReverseResponse = {
  display_name?: string
  address?: NominatimAddress
}

export type ReverseGeocodeResult = {
  address: string
  district: string
}

function pickDistrict(address?: NominatimAddress): string {
  if (!address) return '현재 위치'
  const gu =
    address.borough || address.city_district || address.county || address.city || address.town || ''
  const dong = address.suburb || address.neighbourhood || address.quarter || address.village || ''
  const result = `${gu} ${dong}`.trim()
  return result || '현재 위치'
}

export async function reverseGeocodeNominatim(params: {
  latitude: number
  longitude: number
}): Promise<ReverseGeocodeResult> {
  const { latitude, longitude } = params
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('zoom', '18')
  url.searchParams.set('addressdetails', '1')

  const response = await fetch(url.toString(), {
    headers: {
      'Accept-Language': 'ko',
    },
  })

  if (!response.ok) {
    throw new Error(`reverse geocode failed: ${response.status}`)
  }

  const data = (await response.json()) as NominatimReverseResponse
  return {
    address: data.display_name || '현재 위치',
    district: pickDistrict(data.address),
  }
}
