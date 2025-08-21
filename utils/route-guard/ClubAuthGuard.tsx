'use client'

import { GuardProps } from '@/types/auth'
import {  usePathname } from 'next/navigation'

const ClubAuthGuard = ({ children }: GuardProps) => {
  const pathName = usePathname()

  const bfAccess = true;
  const isLoading = false

  if (!isLoading && !bfAccess && !pathName?.includes('/create')) {
    return (
      <div className=' flex-1 w-full h-full flex justify-center items-center'>
        <h1>Access Denied</h1>
      </div>
    )
  }
  return children
}

export default ClubAuthGuard
