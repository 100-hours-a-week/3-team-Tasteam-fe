import { useMemo } from 'react'
import { useAuth } from '@/entities/user'
import styles from './AuthStatusIndicator.module.css'

export const AuthStatusIndicator = () => {
  const { isAuthenticated } = useAuth()

  const title = useMemo(() => {
    return `auth: ${isAuthenticated ? 'signed in' : 'signed out'}`
  }, [isAuthenticated])

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        type="button"
        aria-label={`Auth status: ${isAuthenticated ? 'signed in' : 'signed out'}`}
        title={title}
      >
        <span className={[styles.dot, isAuthenticated ? styles.ok : styles.bad].join(' ')} />
      </button>
    </div>
  )
}
