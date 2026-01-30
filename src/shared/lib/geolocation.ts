const STORAGE_KEY = 'location_permission_granted'

export type GeoPosition = {
  latitude: number
  longitude: number
}

export const getLocationPermission = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export const setLocationPermission = (granted: boolean) => {
  localStorage.setItem(STORAGE_KEY, String(granted))
}

export const requestLocationPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      setLocationPermission(false)
      resolve(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission(true)
        resolve(true)
      },
      () => {
        setLocationPermission(false)
        resolve(false)
      },
    )
  })
}

export const getCurrentPosition = (): Promise<GeoPosition | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  })
}
