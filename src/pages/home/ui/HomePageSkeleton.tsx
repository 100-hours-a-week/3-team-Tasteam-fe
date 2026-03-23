import { Skeleton } from '@/shared/ui/skeleton'

export function HomePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* LocationHeader */}
      <Skeleton className="h-14 w-full rounded-none" />
      <div className="flex flex-col gap-5 p-4 pb-20">
        {/* 검색창 */}
        <Skeleton className="h-10 w-full rounded-full" />
        {/* 배너 */}
        <Skeleton className="h-24 w-full rounded-lg sm:h-28" />
        {/* 섹션 1: 가로 스크롤 카드 */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <div className="overflow-hidden rounded-lg border bg-card">
            <Skeleton className="aspect-[21/10] w-full rounded-none" />
            <div className="space-y-2 px-4 pb-4 pt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
        {/* 섹션 2: 카테고리별 거리순 */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-28" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border bg-card">
              <Skeleton className="aspect-[21/10] w-full rounded-none" />
              <div className="space-y-2 px-4 pb-4 pt-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* BottomTabBar */}
      <Skeleton className="fixed bottom-0 h-16 w-full max-w-[430px] rounded-none" />
    </div>
  )
}
