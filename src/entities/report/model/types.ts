export type ReportCategory =
  | 'BUG'
  | 'INAPPROPRIATE_REVIEW'
  | 'INAPPROPRIATE_CONTENT'
  | 'RESTAURANT_INFO'
  | 'SPAM'
  | 'OTHER'

export type ReportCreateRequest = {
  category: ReportCategory
  content: string
}
