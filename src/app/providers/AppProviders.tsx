import { AuthProvider } from '@/entities/user'
import { MemberGroupsProvider } from '@/entities/member'
import { LocationProvider } from '@/entities/location'
import { FcmProvider } from '@/entities/notification'
import { UserActivityProvider } from '@/entities/user-activity'

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <UserActivityProvider>
        <FcmProvider>
          <MemberGroupsProvider>
            <LocationProvider>{children}</LocationProvider>
          </MemberGroupsProvider>
        </FcmProvider>
      </UserActivityProvider>
    </AuthProvider>
  )
}
