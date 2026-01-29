/**
 * 날짜 형식 프리셋을 정의하는 파일입니다.
 */

/// 날짜 형식 프리셋 타입입니다.
export type DateFormatPreset = 'dateTime' | 'date' | 'time' | 'dotDate' | 'dotDateTime'

/// 날짜 형식 프리셋 배열입니다.
export const DATE_FORMAT_PRESETS: DateFormatPreset[] = [
  'dateTime',
  'date',
  'time',
  'dotDate',
  'dotDateTime',
]
