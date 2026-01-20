import styles from './SocialLoginButtons.module.css'

const PROVIDERS = ['Kakao', 'Google', 'Apple'] as const

export const SocialLoginButtons = () => {
  return (
    <div className={styles.container}>
      {PROVIDERS.map((provider) => (
        <button key={provider} className={styles.button} type="button">
          {provider}로 시작하기
        </button>
      ))}
    </div>
  )
}
