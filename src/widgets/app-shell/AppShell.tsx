import type { ReactNode } from 'react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'

type AppShellProps = {
  children: ReactNode
  showTopBar?: boolean
  showBottomBar?: boolean
  topBarTitle?: string
  topBarBackButton?: boolean
  topBarOnBack?: () => void
  topBarActions?: ReactNode
  currentTab?: TabId
  onTabChange?: (tab: TabId) => void
}

export function AppShell({
  children,
  showTopBar = true,
  showBottomBar = true,
  topBarTitle,
  topBarBackButton = false,
  topBarOnBack,
  topBarActions,
  currentTab = 'home',
  onTabChange,
}: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      {showTopBar && (
        <TopAppBar
          title={topBarTitle}
          showBackButton={topBarBackButton}
          onBack={topBarOnBack}
          actions={topBarActions}
        />
      )}
      <main className="flex-1 overflow-auto">{children}</main>
      {showBottomBar && <BottomTabBar currentTab={currentTab} onTabChange={onTabChange} />}
    </div>
  )
}
