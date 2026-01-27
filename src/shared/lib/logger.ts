import { LOG_LEVEL } from '@/shared/config/env'

type LogLevel = 'none' | 'error' | 'warn' | 'info' | 'debug'

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
}

const isLogEnabled = (level: LogLevel): boolean => {
  const current = LOG_LEVEL as LogLevel
  return LOG_LEVEL_PRIORITY[current] >= LOG_LEVEL_PRIORITY[level] && current !== 'none'
}

const noop = () => {}

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

export const logger = {
  error: createMethod(console.error, 'error'),
  warn: createMethod(console.warn, 'warn'),
  info: createMethod(console.info, 'info'),
  debug: createMethod(console.log, 'debug'),
  log: createMethod(console.log, 'debug'),
}
