export type FieldErrorResponse = {
  field: string
  reason: string
  rejectedValue?: unknown
}

export type ErrorResponse<E = unknown> = {
  success: boolean
  code: string
  message: string
  errors?: E
}

export type SuccessResponse<T> = {
  success?: boolean
  data: T
}
