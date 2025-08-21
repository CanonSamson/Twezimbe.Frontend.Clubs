'use client'

import { useEffect, useMemo } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Loader from '@/components/Loader'
import { GuardProps } from '@/types/auth'
import { APP_DEFAULT_GUEST_PATHS, APP_DEFAULT_PATH } from '@/config'
import { UserContext, UserContextType } from '@/contexts/user'
import { useContextSelector } from 'use-context-selector'

const AuthGuard = ({ children }: GuardProps) => {
  const router = useRouter()
  const pathName = usePathname()
  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  )

  const isLoading = useContextSelector(
    UserContext,
    (state: UserContextType) => state.isLoading
  )
  const isAuthenticated = useContextSelector(
    UserContext,
    (state: UserContextType) => state.isAuthenticated
  )
  const allowRedirect = useContextSelector(
    UserContext,
    (state: UserContextType) => state.allowRedirect
  )
  const setAllowRedirect = useContextSelector(
    UserContext,
    (state: UserContextType) => state.setAllowRedirect
  )

  const isGuestPath = useMemo(() => {
    return APP_DEFAULT_GUEST_PATHS.some(path => {
      // Remove query parameters from pathName for comparison
      const cleanPathName = pathName.split('?')[0]

      if (path.includes('[id]')) {
        const pathPattern = new RegExp(`^${path.replace('[id]', '([^/]+)')}$`)
        return pathPattern.test(cleanPathName)
      }
      return path === cleanPathName
    })
  }, [pathName])

  useEffect(() => {
    if (
      isAuthenticated === undefined ||
      isLoading ||
      (pathName.includes('/g/') && !!currentUser?.profile?.userName)
    )
      return

    if (!allowRedirect) return

    if (!isAuthenticated) {
      if (!isGuestPath) {
        router.replace('/login')
        return
      }
    } else {
      if (currentUser?.emailVerified === false) {
        router.replace('/register/check-mail')
        return
      } else if (!currentUser?.profile?.userName) {
        router.replace('/register/complete-profile')
        return
      } else if (isGuestPath) {
        router.replace(APP_DEFAULT_PATH)
        return
      }
    }
  }, [isLoading, isAuthenticated, isGuestPath])

  if (isLoading) {
    return <Loader />
  }

  return children
}

export default AuthGuard
