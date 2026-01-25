import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'

type ListStateType = 'loading' | 'empty' | 'error'

type ListStateProps = {
  type: ListStateType
  icon?: LucideIcon
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
}

const STANDARD_MESSAGES = {
  network: {
    title: '네트워크 오류',
    description: '인터넷 연결을 확인하고 다시 시도해 주세요.',
  },
  server: {
    title: '요청을 처리하지 못했어요',
    description: '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  },
  notFound: {
    title: '페이지를 찾을 수 없어요',
    description: '요청하신 페이지가 존재하지 않습니다.',
  },
  unauthorized: {
    title: '로그인이 필요해요',
    description: '다시 로그인해 주세요.',
  },
  loading: {
    title: '불러오는 중...',
    description: '잠시만 기다려 주세요',
  },
}

export function ListState({
  type,
  icon: CustomIcon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: ListStateProps) {
  const getDefaults = () => {
    switch (type) {
      case 'loading':
        return {
          Icon: Loader2,
          title: title || STANDARD_MESSAGES.loading.title,
          description: description || STANDARD_MESSAGES.loading.description,
          iconClassName: 'animate-spin',
        }
      case 'error':
        return {
          Icon: AlertTriangle,
          title: title || STANDARD_MESSAGES.server.title,
          description: description || STANDARD_MESSAGES.server.description,
          actionLabel: actionLabel || '다시 시도',
          iconClassName: 'text-destructive',
        }
      case 'empty':
        return {
          Icon: CustomIcon,
          title: title || '데이터가 없어요',
          description: description,
          actionLabel,
          iconClassName: 'text-muted-foreground',
        }
      default:
        return {
          Icon: CustomIcon,
          title,
          description,
          actionLabel,
          iconClassName: '',
        }
    }
  }

  const defaults = getDefaults()
  const Icon = CustomIcon || defaults.Icon

  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}
    >
      {Icon && (
        <div className="mb-4 p-4 rounded-full bg-muted">
          <Icon className={cn('h-8 w-8', defaults.iconClassName)} />
        </div>
      )}
      <h3 className="mb-2">{defaults.title}</h3>
      {defaults.description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">{defaults.description}</p>
      )}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {(defaults.actionLabel || actionLabel) && onAction && (
          <Button onClick={onAction} className="w-full">
            {type === 'error' && <RefreshCw className="w-4 h-4 mr-2" />}
            {defaults.actionLabel || actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline" className="w-full">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export const ERROR_MESSAGES = STANDARD_MESSAGES
