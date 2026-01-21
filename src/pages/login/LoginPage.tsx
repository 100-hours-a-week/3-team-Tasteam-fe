import { SocialLoginButtons } from '@/features/auth/social-login/SocialLoginButtons'
import styles from './LoginPage.module.css'

export const LoginPage = () => {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tasteam</h1>
        <p className={styles.subtitle}>팀의 점심을 더 빠르게 결정해요</p>
      </header>

      <section className={styles.actions}>
        <SocialLoginButtons />
      </section>
    </main>
  )
}
