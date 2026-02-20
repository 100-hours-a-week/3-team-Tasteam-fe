import { useContext } from 'react'
import { UserActivityContext } from './UserActivityContext'

export const useUserActivity = () => {
  const context = useContext(UserActivityContext)
  if (!context) {
    throw new Error('useUserActivity는 UserActivityProvider 내부에서 사용해야 합니다.')
  }
  return context
}
