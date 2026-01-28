import { useContext } from 'react'
import { MemberGroupsContext } from './memberGroupsContext'

export const useMemberGroups = () => {
  const context = useContext(MemberGroupsContext)
  if (!context) {
    throw new Error('useMemberGroups must be used within MemberGroupsProvider')
  }
  return context
}
