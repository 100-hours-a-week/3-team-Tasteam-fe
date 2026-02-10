import axios from 'axios'
import type { ErrorResponse } from '@/shared/types/api'

export const getApiErrorCode = (error: unknown): ErrorResponse['code'] | undefined => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.code
  }
  return undefined
}
