import { useEffect, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { toast } from 'sonner'
import { APP_ENV } from '@/shared/config/env'

const UPDATE_TOAST_ID = 'pwa-update-available'
const UPDATE_CHECK_INTERVAL_MS = 10 * 60 * 1000
const CONTROLLER_CHANGE_TIMEOUT_MS = 5000
const SHOULD_ENABLE_UPDATE_PROMPT = APP_ENV === 'staging' || APP_ENV === 'production'

export function usePwaUpdatePrompt(): void {
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator
  const shownRef = useRef(false)
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (!SHOULD_ENABLE_UPDATE_PROMPT || !isSupported) return

    const checkForUpdate = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        await registration?.update()
      } catch (error) {
        console.debug('[pwa] 서비스 워커 업데이트 체크 실패', error)
      }
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void checkForUpdate()
      }
    }

    void checkForUpdate()
    window.addEventListener('focus', checkForUpdate)
    window.addEventListener('online', checkForUpdate)
    document.addEventListener('visibilitychange', onVisible)
    const intervalId = window.setInterval(() => {
      void checkForUpdate()
    }, UPDATE_CHECK_INTERVAL_MS)

    return () => {
      window.removeEventListener('focus', checkForUpdate)
      window.removeEventListener('online', checkForUpdate)
      document.removeEventListener('visibilitychange', onVisible)
      window.clearInterval(intervalId)
    }
  }, [isSupported])

  useEffect(() => {
    if (!needRefresh) {
      shownRef.current = false
      toast.dismiss(UPDATE_TOAST_ID)
    }
  }, [needRefresh])

  useEffect(() => {
    if (!SHOULD_ENABLE_UPDATE_PROMPT || !isSupported || !needRefresh || shownRef.current) return
    shownRef.current = true

    const applyUpdate = async () => {
      toast.dismiss(UPDATE_TOAST_ID)
      shownRef.current = false

      let reloaded = false
      let timeoutId: ReturnType<typeof window.setTimeout> | null = null

      const onControllerChange = () => {
        if (reloaded) return
        reloaded = true
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId)
        }
        window.location.reload()
      }

      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange, {
        once: true,
      })
      timeoutId = window.setTimeout(() => {
        if (reloaded) return
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
        toast.error('업데이트 적용에 실패했습니다. 다시 시도해주세요.')
      }, CONTROLLER_CHANGE_TIMEOUT_MS)

      try {
        await updateServiceWorker(true)
      } catch (error) {
        window.clearTimeout(timeoutId)
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
        toast.error('업데이트 적용에 실패했습니다. 다시 시도해주세요.')
      }
    }

    toast.message('새 버전이 있습니다. 지금 업데이트할까요?', {
      id: UPDATE_TOAST_ID,
      duration: Infinity,
      action: {
        label: '업데이트',
        onClick: () => {
          void applyUpdate()
        },
      },
    })
  }, [isSupported, needRefresh, updateServiceWorker])
}
