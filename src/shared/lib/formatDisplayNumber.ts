type FormatDisplayNumberOptions = {
  hideZero?: boolean
}

const THOUSAND = 1_000 // threshold for switching to K units
const MILLION = 1_000_000 // threshold for switching to M units

const stripOptionalDecimal = (value: number, digits: number) => {
  const formatted = value.toFixed(digits)
  return formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted
}

// 0~999 구간은 소수 첫째 자리까지 표현하되 `.0`은 제거해서 깔끔하게 반환합니다.
const formatSmallNumber = (value: number) => {
  if (Number.isInteger(value)) {
    return String(value)
  }
  return value.toFixed(2).replace(/\.?0+$/, '')
}

// 1,000,000 이상은 소수 첫째 자리까지 반올림한 뒤 `M` 붙여서 반환합니다.
const formatMillions = (value: number, sign: string) => {
  const normalized = value / MILLION
  const rounded = Math.round(normalized * 10) / 10
  return `${sign}${stripOptionalDecimal(rounded, 1)}M`
}

// 10K~999K 구간은 정수 `K` 표기를 우선으로 하되, 1M이 넘으면 `M`으로 위임합니다.
const formatThousandsLarge = (value: number, sign: string) => {
  const normalized = Math.round(value / THOUSAND)
  if (normalized >= THOUSAND) {
    return formatMillions(value, sign)
  }
  return `${sign}${normalized}K`
}

// 1K~9.9K 구간은 소수 첫째 자리까지 반올림한 `x.xK` 표기를 사용합니다.
const formatThousandsSmall = (value: number, sign: string) => {
  const normalized = value / THOUSAND
  const rounded = Math.round(normalized * 10) / 10
  return `${sign}${stripOptionalDecimal(rounded, 1)}K`
}

/**
 * shared 전역 숫자 표시 정책을 적용한 문자열을 반환합니다.
 *
 * 정책 요약:
 * - 0~999: 그대로
 * - 1,000~9,999: 소수점 한 자리까지 (`x.xK`, 1.0K ⇒ 1K)
 * - 10,000~999,999: `xxK` (가독성 우선)
 * - 1,000,000 이상: 소수점 한 자리 (`x.xM`, 1.0M ⇒ 1M)
 * - 값이 없거나 유한 숫자가 아닌 경우, 옵션에 따라 `0` 또는 빈 문자열
 */
export const formatDisplayNumber = (
  value: number | null | undefined,
  options?: FormatDisplayNumberOptions,
) => {
  const hideZero = options?.hideZero === true

  if (value == null || !Number.isFinite(value)) {
    return hideZero ? '' : '0'
  }

  if (value === 0) {
    return hideZero ? '' : '0'
  }

  const sign = value < 0 ? '-' : ''
  const absolute = Math.abs(value)

  if (absolute < THOUSAND) {
    return `${sign}${formatSmallNumber(absolute)}`
  }

  if (absolute < 10_000) {
    return formatThousandsSmall(absolute, sign)
  }

  if (absolute < MILLION) {
    return formatThousandsLarge(absolute, sign)
  }

  return formatMillions(absolute, sign)
}
