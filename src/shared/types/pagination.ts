export type CursorPagination = {
  nextCursor: string | null
  size: number
  hasNext: boolean
}

export type CursorPageResponse<T> = {
  items: T[]
  pagination: CursorPagination
}

export type OffsetPagination = {
  page: number
  size: number
  totalPages: number
  totalElements: number
}

export type OffsetPageResponse<T> = {
  items: T[]
  pagination: OffsetPagination
}

export type ItemsPageResponse<T> = CursorPageResponse<T>
