import styles from './SplashPage.module.css'

type SplashPageProps = {
  isFadingOut?: boolean
}

export const SplashPage = ({ isFadingOut = false }: SplashPageProps) => {
  return (
    <main className={`${styles.splash} ${isFadingOut ? styles.fadeOut : ''}`}>
      <h1 className={styles.title}>Tasteam</h1>
    </main>
  )
}
