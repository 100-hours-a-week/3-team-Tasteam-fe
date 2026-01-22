import { API_ENDPOINTS } from '@/shared/config/routes'
import { request } from '@/shared/api/request'

export const getHealth = () => {
  return request<unknown>({
    method: 'GET',
    url: API_ENDPOINTS.health,
    timeout: 5000,
  })
}
