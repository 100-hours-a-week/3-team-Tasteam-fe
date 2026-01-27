export type QueryValue = string | number | boolean | null | undefined

/**
 * API Query 파라미터를 생성합니다.
 * @param params
 * @returns
 */
export const buildQuery = (params: Record<string, QueryValue>): string => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}
