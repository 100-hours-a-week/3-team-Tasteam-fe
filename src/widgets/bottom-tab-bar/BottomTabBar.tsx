import { Home, Search, Users, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export type TabId = 'home' | 'search' | 'groups' | 'profile'

type BottomTabBarProps = {
  currentTab: TabId
  onTabChange?: (tab: TabId) => void
}

const tabs = [
  { id: 'home' as const, icon: Home, label: '홈' },
  { id: 'search' as const, icon: Search, label: '검색' },
  { id: 'groups' as const, icon: Users, label: '그룹' },
  { id: 'profile' as const, icon: User, label: '프로필' },
]

export function BottomTabBar({ currentTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-0 flex-1 transition-colors',
                'hover:bg-accent rounded-lg',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} />
              <span className="text-xs truncate w-full text-center">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
