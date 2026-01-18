import type { DateFormatPreset } from '../constants/date'

type FormatOptions = {
  preset?: DateFormatPreset
  includeSeconds?: boolean
}

const pad2 = (value: number) => String(value).padStart(2, '0')

const formatYmd = (date: Date, separator: string) => {
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())

  return `${year}${separator}${month}${separator}${day}`
}

const formatTime = (date: Date, includeSeconds: boolean) => {
  const hours = pad2(date.getHours())
  const minutes = pad2(date.getMinutes())
  const seconds = pad2(date.getSeconds())

  return includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
}

/**
 * ISO 타임스탬프를 받아 다양한 형식으로 변환합니다.
 * `preset`으로 년/월/일/시간 조합을 선택하고, `includeSeconds`로 초 추가 여부를 결정합니다.
 */
export const formatIsoTimestamp = (
  isoString: string,
  { preset = 'dateTime', includeSeconds = false }: FormatOptions = {},
) => {
  const date = new Date(isoString)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  switch (preset) {
    case 'date':
      return formatYmd(date, '-')
    case 'time':
      return formatTime(date, includeSeconds)
    case 'dotDate':
      return formatYmd(date, '.')
    case 'dotDateTime':
      return `${formatYmd(date, '.')} ${formatTime(date, includeSeconds)}`
    case 'dateTime':
    default:
      return `${formatYmd(date, '-')} ${formatTime(date, includeSeconds)}`
  }
}
