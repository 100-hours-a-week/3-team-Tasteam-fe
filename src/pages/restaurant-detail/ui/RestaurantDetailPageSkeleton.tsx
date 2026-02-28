import { Skeleton } from '@/shared/ui/skeleton'

export function RestaurantDetailPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* TopAppBar */}
      <Skeleton className="h-14 w-full rounded-none" />
      {/* 이미지 캐러셀 */}
      <Skeleton className="h-60 w-full rounded-none" />
      <div className="flex flex-col gap-4 p-4">
        {/* 식당 이름 */}
        <Skeleton className="h-7 w-48" />
        {/* 카테고리 */}
        <Skeleton className="h-4 w-32" />
        {/* 주소 / 영업시간 */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        {/* 탭 */}
        <Skeleton className="h-10 w-full rounded-lg" />
        {/* 탭 콘텐츠 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
