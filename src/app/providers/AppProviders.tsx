import { AuthProvider } from '@/entities/user/model/AuthProvider'
import { MemberGroupsProvider } from '@/entities/member/model/MemberGroupsProvider'

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <MemberGroupsProvider>{children}</MemberGroupsProvider>
    </AuthProvider>
  )
}
