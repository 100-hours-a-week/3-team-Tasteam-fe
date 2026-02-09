import { AuthProvider } from '@/entities/user'
import { MemberGroupsProvider } from '@/entities/member'
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
