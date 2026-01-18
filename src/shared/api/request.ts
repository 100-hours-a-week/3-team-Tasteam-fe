import type { AxiosRequestConfig } from 'axios'
import { http } from './http'

export const request = async <TResponse>(config: AxiosRequestConfig): Promise<TResponse> => {
  const response = await http.request<TResponse>(config)
  return response.data
}
