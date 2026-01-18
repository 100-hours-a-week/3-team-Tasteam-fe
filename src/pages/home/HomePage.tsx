import { BottomTabBar } from '@/widgets/bottom-tab-bar/BottomTabBar'

export const HomePage = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Tasteam</h1>
      </header>
      <main className="page-content" />
      <BottomTabBar />
    </div>
  )
}
