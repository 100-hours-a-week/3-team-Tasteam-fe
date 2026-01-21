import styles from './SocialLoginButtons.module.css'
import { getOAuthStartUrl, storeReturnPath } from './api'

const PROVIDERS = [
  { label: 'Kakao', key: 'kakao' },
  { label: 'Google', key: 'google' },
  { label: 'Apple', key: 'apple' },
] as const

export const SocialLoginButtons = () => {
  const redirectUri = `${window.location.origin}/oauth/callback`

  return (
    <div className={styles.container}>
      {PROVIDERS.map((provider) => (
        <button
          key={provider.key}
          className={styles.button}
          type="button"
          onClick={() => {
            storeReturnPath(window.location.pathname)
            window.location.href = getOAuthStartUrl(provider.key, redirectUri)
          }}
        >
          {provider.label}로 시작하기
        </button>
      ))}
    </div>
  )
}
