import { Skeleton } from '@/shared/ui/skeleton'

export function HomePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* LocationHeader */}
      <Skeleton className="h-14 w-full rounded-none" />
      <div className="flex flex-col gap-5 p-4 pb-20">
        {/* 검색창 */}
        <Skeleton className="h-10 w-full rounded-full" />
        {/* 섹션 1: 가로 스크롤 카드 */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-40 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>
        {/* 섹션 2: 세로 목록 카드 */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-28" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
      {/* BottomTabBar */}
      <Skeleton className="fixed bottom-0 h-16 w-full max-w-[430px] rounded-none" />
    </div>
  )
}
