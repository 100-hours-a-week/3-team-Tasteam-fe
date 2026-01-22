import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getHealth } from '@/shared/api/health'
import styles from './HealthStatusIndicator.module.css'

const POLL_INTERVAL_MS = 60_000

type HealthState = {
  isHealthy: boolean
  isChecking: boolean
  lastCheckedAt: number | null
  lastLatencyMs: number | null
}

const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp))

export const HealthStatusIndicator = () => {
  const [state, setState] = useState<HealthState>({
    isHealthy: false,
    isChecking: true,
    lastCheckedAt: null,
    lastLatencyMs: null,
  })

  const inFlightRef = useRef(false)
  const intervalIdRef = useRef<number | null>(null)

  const runCheck = useCallback(async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    const startedAt = performance.now()

    setState((prev) => ({ ...prev, isChecking: true }))

    try {
      await getHealth()
      const latency = Math.round(performance.now() - startedAt)
      setState({
        isHealthy: true,
        isChecking: false,
        lastCheckedAt: Date.now(),
        lastLatencyMs: latency,
      })
    } catch {
      const latency = Math.round(performance.now() - startedAt)
      setState({
        isHealthy: false,
        isChecking: false,
        lastCheckedAt: Date.now(),
        lastLatencyMs: latency,
      })
    } finally {
      inFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    void runCheck()

    intervalIdRef.current = window.setInterval(() => {
      void runCheck()
    }, POLL_INTERVAL_MS)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void runCheck()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (intervalIdRef.current) {
        window.clearInterval(intervalIdRef.current)
      }
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [runCheck])

  const title = useMemo(() => {
    const statusText = state.isHealthy ? 'connected' : 'disconnected'
    const lastCheckedText = state.lastCheckedAt ? formatTime(state.lastCheckedAt) : '—'
    const latencyText = state.lastLatencyMs !== null ? `${state.lastLatencyMs}ms` : '—'
    return `server: ${statusText}\nlast check: ${lastCheckedText}\nlatency: ${latencyText}`
  }, [state.isHealthy, state.lastCheckedAt, state.lastLatencyMs])

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        type="button"
        aria-label={`Server health: ${state.isHealthy ? 'connected' : 'disconnected'}`}
        title={title}
        onClick={() => {
          void runCheck()
        }}
      >
        <span
          className={[
            styles.dot,
            state.isHealthy ? styles.ok : styles.bad,
            state.isChecking ? styles.checking : '',
          ].join(' ')}
        />
      </button>
    </div>
  )
}
