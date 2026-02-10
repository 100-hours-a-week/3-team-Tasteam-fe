type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

/**
 * 다양한 API 응답 래핑 형태(T, {data:T}, {data:{data:T}})를 단일 payload로 정규화한다.
 */
export const extractResponseData = <T>(response: unknown): T | undefined => {
  if (!isRecord(response)) return undefined

  const directData = response.data
  if (isRecord(directData) && 'data' in directData) {
    return directData.data as T
  }

  if (directData !== undefined) {
    return directData as T
  }

  return response as T
}
