import type { ComponentProps } from 'react'
import { formatAppVersion } from '@/shared/config/appInfo'
import { cn } from '@/shared/lib/utils'

type AppVersionTextProps = ComponentProps<'span'> & {
  withPrefix?: boolean
}

export function AppVersionText({ className, withPrefix = true, ...props }: AppVersionTextProps) {
  const text = withPrefix ? formatAppVersion() : __APP_VERSION__

  return (
    <span className={cn(className)} {...props}>
      {text}
    </span>
  )
}
