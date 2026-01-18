import styles from './BottomTabBar.module.css'

const TABS = [
  { label: '홈', key: 'home' },
  { label: '탐색', key: 'explore' },
  { label: '알림', key: 'notifications' },
  { label: '내정보', key: 'profile' },
]

export const BottomTabBar = () => {
  return (
    <nav className={styles.bar} aria-label="하단 탭">
      {TABS.map((tab) => (
        <button key={tab.key} className={styles.tab} type="button">
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
