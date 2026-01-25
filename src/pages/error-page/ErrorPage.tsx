import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/shared/ui/button'

type ErrorPageProps = {
  title?: string
  description?: string
  onRetry?: () => void
  onHome?: () => void
}

export function ErrorPage({
  title = '문제가 발생했어요',
  description = '요청을 처리하는 중에 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
  onRetry,
  onHome,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-xl font-semibold mb-2">{title}</h1>
        <p className="text-muted-foreground whitespace-pre-line mb-8">{description}</p>

        <div className="flex gap-3 w-full">
          {onHome && (
            <Button variant="outline" className="flex-1" onClick={onHome}>
              <Home className="w-4 h-4 mr-2" />
              홈으로
            </Button>
          )}
          {onRetry && (
            <Button className="flex-1" onClick={onRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
