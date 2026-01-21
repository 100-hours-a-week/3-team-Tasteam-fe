import { AuthProvider } from '@/entities/user/model/AuthProvider'

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}
