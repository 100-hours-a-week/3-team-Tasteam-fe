import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import {
  ACTIVITY_DEBUG,
  ACTIVITY_ENABLED,
  ACTIVITY_FLUSH_INTERVAL_MS,
  ACTIVITY_MAX_BATCH_SIZE,
  ACTIVITY_MAX_QUEUE_SIZE,
} from '@/shared/config/env'
import { ActivityDispatcher } from './activityDispatcher'
import { getOrCreateAnonymousId } from './anonymousId'
import { ActivityQueue } from './activityQueue'
import { getOrCreateActivitySessionId, resolvePageContext } from './session'
import { UserActivityContext } from './UserActivityContext'

type DwellExitType = 'route_change' | 'hidden' | 'unload'

type PageVisitState = {
  pageKey: string
  pathTemplate: string
  sessionId: string
  visibleStartedAt: number | null
  accumulatedVisibleMs: number
}

export const UserActivityProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation()

  const tracker = useMemo(() => {
    const queue = new ActivityQueue(ACTIVITY_MAX_QUEUE_SIZE)
    return new ActivityDispatcher({
      enabled: ACTIVITY_ENABLED,
      debug: ACTIVITY_DEBUG,
      flushIntervalMs: ACTIVITY_FLUSH_INTERVAL_MS,
      maxBatchSize: ACTIVITY_MAX_BATCH_SIZE,
      queue,
      anonymousId: getOrCreateAnonymousId(),
    })
  }, [])

  const visitRef = useRef<PageVisitState | null>(null)
  const previousPathTemplateRef = useRef<string | null>(null)
  const lastUnloadEmitAtRef = useRef(0)

  const emitDwell = useCallback(
    (exitType: DwellExitType, options?: { flushKeepalive?: boolean }) => {
      const currentVisit = visitRef.current
      if (!currentVisit) {
        return
      }

      const now = Date.now()
      const visibleTailMs =
        currentVisit.visibleStartedAt == null ? 0 : Math.max(0, now - currentVisit.visibleStartedAt)
      const dwellMs = Math.round(currentVisit.accumulatedVisibleMs + visibleTailMs)

      if (dwellMs <= 0) {
        currentVisit.accumulatedVisibleMs = 0
        currentVisit.visibleStartedAt = document.visibilityState === 'visible' ? Date.now() : null
        return
      }

      tracker.track({
        eventName: 'ui.page.dwelled',
        properties: {
          pageKey: currentVisit.pageKey,
          pathTemplate: currentVisit.pathTemplate,
          dwellMs,
          exitType,
          sessionId: currentVisit.sessionId,
        },
      })

      currentVisit.accumulatedVisibleMs = 0
      currentVisit.visibleStartedAt = document.visibilityState === 'visible' ? Date.now() : null

      if (options?.flushKeepalive) {
        void tracker.flush({ keepalive: true })
      }
    },
    [tracker],
  )

  useEffect(() => {
    tracker.start()
    return () => {
      tracker.stop()
    }
  }, [tracker])

  useEffect(() => {
    tracker.setEnabled(ACTIVITY_ENABLED)
  }, [tracker])

  useEffect(() => {
    const currentVisit = visitRef.current
    if (currentVisit) {
      emitDwell('route_change')
    }

    const pageContext = resolvePageContext(location.pathname)
    const sessionId = getOrCreateActivitySessionId()
    const referrerPathTemplate = previousPathTemplateRef.current

    tracker.track({
      eventName: 'ui.page.viewed',
      properties: {
        pageKey: pageContext.pageKey,
        pathTemplate: pageContext.pathTemplate,
        referrerPathTemplate,
        sessionId,
      },
    })

    previousPathTemplateRef.current = pageContext.pathTemplate
    visitRef.current = {
      pageKey: pageContext.pageKey,
      pathTemplate: pageContext.pathTemplate,
      sessionId,
      visibleStartedAt: document.visibilityState === 'visible' ? Date.now() : null,
      accumulatedVisibleMs: 0,
    }
  }, [location.pathname, tracker, emitDwell])

  useEffect(() => {
    const onVisibilityChange = () => {
      const currentVisit = visitRef.current
      if (!currentVisit) return

      if (document.visibilityState === 'hidden') {
        if (currentVisit.visibleStartedAt != null) {
          currentVisit.accumulatedVisibleMs += Math.max(
            0,
            Date.now() - currentVisit.visibleStartedAt,
          )
          currentVisit.visibleStartedAt = null
        }
        emitDwell('hidden', { flushKeepalive: true })
        return
      }

      if (currentVisit.visibleStartedAt == null) {
        currentVisit.visibleStartedAt = Date.now()
      }
    }

    const onPageHide = () => {
      const now = Date.now()
      if (now - lastUnloadEmitAtRef.current < 500) {
        return
      }
      lastUnloadEmitAtRef.current = now
      emitDwell('unload', { flushKeepalive: true })
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pagehide', onPageHide)
    window.addEventListener('beforeunload', onPageHide)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', onPageHide)
      window.removeEventListener('beforeunload', onPageHide)
    }
  }, [emitDwell, tracker])

  return <UserActivityContext.Provider value={tracker}>{children}</UserActivityContext.Provider>
}
