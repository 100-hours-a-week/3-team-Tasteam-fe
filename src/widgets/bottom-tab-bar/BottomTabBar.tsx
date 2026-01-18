const TABS = [
  { label: '홈', key: 'home' },
  { label: '탐색', key: 'explore' },
  { label: '알림', key: 'notifications' },
  { label: '내정보', key: 'profile' },
]

export const BottomTabBar = () => {
  return (
    <nav className="bottom-tab-bar" aria-label="하단 탭">
      {TABS.map((tab) => (
        <button key={tab.key} className="bottom-tab" type="button">
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
