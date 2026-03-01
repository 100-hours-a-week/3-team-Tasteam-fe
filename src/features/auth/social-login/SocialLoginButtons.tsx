import styles from './SocialLoginButtons.module.css'
import { getOAuthStartUrl, storeReturnPath } from './api'

const PROVIDERS = [
  { label: 'Google', key: 'google' },
  { label: 'Kakao', key: 'kakao' },
] as const

const KakaoIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M12 4.2C7.3 4.2 3.5 7.14 3.5 10.77c0 2.25 1.45 4.24 3.66 5.39-.16.57-.58 2.07-.67 2.39-.1.37.14.37.29.27.12-.08 1.89-1.27 2.65-1.79.52.08 1.05.12 1.61.12 4.7 0 8.5-2.94 8.5-6.58S16.7 4.2 12 4.2z"
      fill="#000000"
    />
  </svg>
)

const GoogleIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M23.2 12.3c0-.8-.07-1.36-.22-1.95H12v3.7h6.35c-.13.92-.83 2.3-2.37 3.23l-.02.12 3.46 2.66.24.02c2.2-2.02 3.54-4.99 3.54-7.81z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.24 0 5.96-1.06 7.95-2.88l-3.79-2.94c-1.01.7-2.38 1.2-4.16 1.2-3.17 0-5.86-2.02-6.82-4.81l-.11.01-3.57 2.76-.04.1C3.43 20.89 7.46 24 12 24z"
      fill="#34A853"
    />
    <path
      d="M5.18 14.57c-.25-.75-.39-1.55-.39-2.37s.14-1.62.38-2.37l-.01-.16L1.56 6.9l-.12.05A12.04 12.04 0 000 12.2c0 1.93.46 3.75 1.3 5.35l3.88-2.98z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.8c2.08 0 3.48.9 4.28 1.64l3.12-3.02C17.95 1.95 15.24.8 12 .8 7.46.8 3.43 3.9 1.3 7.05l3.87 2.98C6.13 6.82 8.83 4.8 12 4.8z"
      fill="#EB4335"
    />
  </svg>
)

export const SocialLoginButtons = () => {
  const redirectUri = `${window.location.origin}/oauth/callback`

  return (
    <div className={styles.container}>
      {PROVIDERS.map((provider) => (
        <button
          key={provider.key}
          className={`${styles.button} ${styles[provider.key]}`}
          type="button"
          onClick={() => {
            if (!sessionStorage.getItem('auth:return_to')) {
              storeReturnPath(window.location.pathname)
            }
            window.location.replace(getOAuthStartUrl(provider.key, redirectUri))
          }}
        >
          <span className={styles.buttonContent}>
            {provider.key === 'kakao' ? <KakaoIcon /> : <GoogleIcon />}
            <span>{provider.label}로 시작하기</span>
          </span>
        </button>
      ))}
    </div>
  )
}
