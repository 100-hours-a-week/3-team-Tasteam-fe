import { LOG_LEVEL } from '@/shared/config/env'

type LogLevel = 'none' | 'error' | 'warn' | 'info' | 'debug'

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
}

/**
 * 로그 레벨이 활성화되어 있는지 확인합니다.
 * @param level 로그 레벨
 * @returns 활성화 여부
 */
const isLogEnabled = (level: LogLevel): boolean => {
  const current = LOG_LEVEL as LogLevel
  return LOG_LEVEL_PRIORITY[current] >= LOG_LEVEL_PRIORITY[level] && current !== 'none'
}

const noop = () => {}

/**
 * 로그 메서드를 생성합니다.
 * @param method 로그 메서드
 * @param level 로그 레벨
 * @returns 로그 메서드
 */
const createMethod = (
  method: (...args: unknown[]) => void,
  level: 'error' | 'warn' | 'info' | 'debug',
): ((...args: unknown[]) => void) => {
  if (!isLogEnabled(level)) return noop
  return (...args: unknown[]) => {
    const [first, ...rest] = args
    if (rest.length > 0 && typeof first === 'string') {
      method(first + '\n', ...rest)
    } else {
      method(...args)
    }
  }
}

/// 로거 객체
export const logger = {
  error: createMethod(console.error, 'error'),
  warn: createMethod(console.warn, 'warn'),
  info: createMethod(console.info, 'info'),
  debug: createMethod(console.log, 'debug'),
  log: createMethod(console.log, 'debug'),
}
