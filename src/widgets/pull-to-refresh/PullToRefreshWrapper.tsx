import type { ReactNode } from 'react'
import PullToRefresh from 'react-pull-to-refresh'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

type PullToRefreshWrapperProps = {
  onRefresh: () => Promise<void>
  children: ReactNode
  disabled?: boolean
}

export function PullToRefreshWrapper({
  onRefresh,
  children,
  disabled = false,
}: PullToRefreshWrapperProps) {
  const handleRefresh = async () => {
    if (disabled) return

    try {
      await onRefresh()
    } catch {
      toast.error('새로고침 실패', {
        description: '잠시 후 다시 시도해 주세요',
        action: {
          label: '재시도',
          onClick: () => handleRefresh(),
        },
      })
    }
  }

  if (disabled) {
    return <>{children}</>
  }

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      style={{
        textAlign: 'center',
        overflow: 'hidden',
      }}
      icon={
        <div className="flex items-center justify-center py-2">
          <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
      }
      loading={
        <div className="flex items-center justify-center py-2">
          <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
      }
    >
      {children}
    </PullToRefresh>
  )
}
