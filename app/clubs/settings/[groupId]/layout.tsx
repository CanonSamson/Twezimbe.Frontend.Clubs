// PROJECT IMPORTS
import ClubAuthGuard from '@/utils/route-guard/ClubAuthGuard'
import ClubSettings from '../_components/ClubSettings'
import { ClubProvider } from '@/contexts/club'

export default function ClubLayout ({ children }: { children: React.ReactNode }) {
  return (
    <ClubProvider>
      <ClubAuthGuard>
        <ClubSettings>{children}</ClubSettings>
      </ClubAuthGuard>
    </ClubProvider>
  )
}
