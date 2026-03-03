import { Skeleton } from './skeleton'

/** 페이지별 Skeleton이 없는 라우트에 사용하는 범용 fallback */
export function GenericPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Skeleton className="h-14 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
