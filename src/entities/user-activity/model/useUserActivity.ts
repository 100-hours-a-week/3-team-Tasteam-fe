import { useContext } from 'react'
import { UserActivityContext } from './UserActivityContext'

export const useUserActivity = () => useContext(UserActivityContext)
