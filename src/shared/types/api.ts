export type ApiResponse<T> = {
  data: T
  message?: string
  code?: string | number
  success?: boolean
}

export type ApiErrorResponse = {
  message?: string
  code?: string | number
  errors?: Record<string, string[]>
}
