import { BottomTabBar } from '@/widgets/bottom-tab-bar/BottomTabBar'
import { useAuth } from '@/entities/user/model/useAuth'
import { request } from '@/shared/api/request'
import { API_ENDPOINTS } from '@/shared/config/routes'
import styles from './HomePage.module.css'

export const HomePage = () => {
  const { openLogin, isAuthenticated, accessToken, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await request({ method: 'POST', url: API_ENDPOINTS.logout })
    } finally {
      logout()
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tasteam</h1>
      </header>
      <main className={styles.content}>
        {isAuthenticated ? (
          <>
            <p className={styles.tokenLabel}>Access Token</p>
            <code className={styles.tokenValue}>{accessToken}</code>
            <button className={styles.secondaryButton} type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button className={styles.primaryButton} type="button" onClick={openLogin}>
              로그인
            </button>
            <button className={styles.secondaryButton} type="button" onClick={openLogin}>
              보호된 기능 보기
            </button>
          </>
        )}
      </main>
      <BottomTabBar />
    </div>
  )
}
