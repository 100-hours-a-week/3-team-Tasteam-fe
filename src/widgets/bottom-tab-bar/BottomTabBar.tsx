import { Home, Search, Heart, Users, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { logger } from '@/shared/lib/logger'

export type TabId = 'home' | 'search' | 'favorites' | 'groups' | 'profile'

type BottomTabBarProps = {
  currentTab: TabId
  onTabChange?: (tab: TabId) => void
}

const tabs = [
  { id: 'search' as const, icon: Search, label: '검색' },
  { id: 'groups' as const, icon: Users, label: '그룹' },
  { id: 'home' as const, icon: Home, label: '홈' },
  { id: 'favorites' as const, icon: Heart, label: '찜' },
  { id: 'profile' as const, icon: User, label: '프로필' },
]

export function BottomTabBar({ currentTab, onTabChange }: BottomTabBarProps) {
  const handleTabClick = (tabId: TabId) => {
    try {
      onTabChange?.(tabId)
    } catch (error) {
      logger.error('[BottomTabBar] tab click failed', { tabId, error })
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:left-1/2 md:right-auto md:w-full md:max-w-[var(--app-max-width)] md:-translate-x-1/2">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
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
