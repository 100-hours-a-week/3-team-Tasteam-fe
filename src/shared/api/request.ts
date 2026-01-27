import type { AxiosRequestConfig } from 'axios'
import { http } from './http'

/**
 * axios 요청을 감싸고 response.data만 반환하는 헬퍼.
 * @param config axios 요청 설정
 * @returns 요청 결과 데이터
 */
export const request = async <TResponse>(config: AxiosRequestConfig): Promise<TResponse> => {
  const response = await http.request<TResponse>(config)
  return response.data
}
