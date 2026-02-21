import { createContext } from 'react'
import type { UserActivityTracker } from './types'

const noopTracker: UserActivityTracker = {
  track: () => undefined,
  flush: async () => undefined,
  setEnabled: () => undefined,
}

export const UserActivityContext = createContext<UserActivityTracker>(noopTracker)
