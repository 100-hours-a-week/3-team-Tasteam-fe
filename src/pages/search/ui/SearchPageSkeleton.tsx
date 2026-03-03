import { Skeleton } from '@/shared/ui/skeleton'

export function SearchPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* TopAppBar */}
      <Skeleton className="h-14 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4 pb-20">
        {/* 검색 입력 */}
        <Skeleton className="h-10 w-full rounded-full" />
        {/* 결과 목록 */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
      {/* BottomTabBar */}
      <Skeleton className="fixed bottom-0 h-16 w-full max-w-[430px] rounded-none" />
    </div>
  )
}
