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
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[260px] shrink-0 overflow-hidden rounded-lg border bg-card">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-2 px-4 pb-4 pt-3">
                  <Skeleton className="h-5 w-2/3" />
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 섹션 2: 세로 목록 카드 */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-28" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="rounded-md border border-primary/10 bg-primary/5 px-2.5 py-1.5">
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="overflow-hidden rounded-lg border bg-card">
                <Skeleton className="aspect-[21/10] w-full rounded-none" />
                <div className="space-y-2 px-4 pb-4 pt-3">
                  <Skeleton className="h-5 w-1/2" />
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
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
