import { BottomTabBar } from '@/widgets/bottom-tab-bar/BottomTabBar'
import styles from './HomePage.module.css'

export const HomePage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tasteam</h1>
      </header>
      <main className={styles.content} />
      <BottomTabBar />
    </div>
  )
}
