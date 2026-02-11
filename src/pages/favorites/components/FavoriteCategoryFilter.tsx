import { Heart, Users, ChevronDown } from 'lucide-react'
import { Container } from '@/shared/ui/container'
import { cn } from '@/shared/lib/utils'
import type { FavoriteTarget, FavoriteTab } from '@/entities/favorite'

type FavoriteCategoryFilterProps = {
  selectedTab: FavoriteTab
  selectedSubgroup: FavoriteTarget | null
  onTabChange: (tab: FavoriteTab) => void
  onSubgroupClick: () => void
}

export function FavoriteCategoryFilter({
  selectedTab,
  selectedSubgroup,
  onTabChange,
  onSubgroupClick,
}: FavoriteCategoryFilterProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border">
      <Container>
        <div className="flex gap-2 py-3">
          {/* 내 찜 탭 */}
          <button
            onClick={() => onTabChange('personal')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all',
              selectedTab === 'personal'
                ? 'bg-primary text-white'
                : 'bg-accent text-foreground hover:bg-accent/80',
            )}
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">내 찜</span>
          </button>

          {/* 그룹 찜 탭 */}
          <button
            onClick={onSubgroupClick}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all',
              selectedTab === 'group'
                ? 'bg-primary text-white'
                : 'bg-accent text-foreground hover:bg-accent/80',
            )}
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {selectedTab === 'group' && selectedSubgroup ? selectedSubgroup.name : '하위 그룹 찜'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </Container>
    </div>
  )
}
