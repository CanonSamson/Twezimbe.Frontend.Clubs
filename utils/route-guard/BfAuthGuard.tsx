'use client'

import { useAppSelector } from '@/lib/hooks'
import { GuardProps } from '@/types/auth'
import { useParams, usePathname } from 'next/navigation'

const BfAuthGuard = ({ children }: GuardProps) => {
  const { bfId } = useParams()
  const { bfUserAcces, bfLoading } = useAppSelector(state => state.bf)
  const pathName = usePathname()

  const bfAccess = Boolean(bfUserAcces?.[bfId as string])
  const isLoading = Boolean(bfLoading?.[bfId as string])

  if (!isLoading && !bfAccess && !pathName?.includes('/create')) {
    return (
      <div className=' flex-1 w-full h-full flex justify-center items-center'>
        <h1>Access Denied</h1>
      </div>
    )
  }
  return children
}

export default BfAuthGuard
