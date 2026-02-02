import { AuthProvider } from '@/entities/user/model/AuthProvider'
import { MemberGroupsProvider } from '@/entities/member/model/MemberGroupsProvider'
import { LocationProvider } from '@/entities/location'

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <MemberGroupsProvider>
        <LocationProvider>{children}</LocationProvider>
      </MemberGroupsProvider>
    </AuthProvider>
  )
}
