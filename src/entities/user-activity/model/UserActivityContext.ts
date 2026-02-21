import { createContext } from 'react'
import type { UserActivityTracker } from './types'

export const UserActivityContext = createContext<UserActivityTracker | null>(null)
