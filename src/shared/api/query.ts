export type QueryValue = string | number | boolean | null | undefined

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
