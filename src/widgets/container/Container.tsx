import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return <div className={cn('px-4', className)}>{children}</div>
}
