import { AuthProvider } from '@/entities/user'
import { MemberGroupsProvider } from '@/entities/member'
import { LocationProvider } from '@/entities/location'
import { FcmProvider } from '@/entities/notification'

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <FcmProvider>
        <MemberGroupsProvider>
          <LocationProvider>{children}</LocationProvider>
        </MemberGroupsProvider>
      </FcmProvider>
    </AuthProvider>
  )
}
