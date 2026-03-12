type AppErrorFallbackProps = {
  onRetry: () => void
  onHome: () => void
}

export function AppErrorFallback({ onRetry, onHome }: AppErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Unexpected Error
        </p>
        <h1 className="text-3xl font-semibold">문제가 발생했습니다</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          잠시 후 다시 시도하거나 홈으로 이동해 주세요.
        </p>
        <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            다시 시도
          </button>
          <button
            type="button"
            onClick={onHome}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  )
}
