'use client'

import { fetchBfBasicInfo } from '@/lib/features/bf/bfSlice'
import { useAppDispatch } from '@/lib/hooks'
import { useParams } from 'next/navigation'
import { createContext, ReactNode, useEffect } from 'react'

// Project imports

// Types

interface BfProviderProps {
  children: ReactNode
}
// Initial state
interface BfContextProps {
  hasAccess: boolean
}
const initialState: BfContextProps = {
  hasAccess: true
}

// ==============================|| NOTIFICATION CONTEXT & PROVIDER ||============================== //

const BfContext = createContext<BfContextProps>(initialState)

function BfProvider ({ children }: BfProviderProps) {
  const dispatch = useAppDispatch()
  const { bfId } = useParams()
  useEffect(() => {
    if (bfId) {
      dispatch(fetchBfBasicInfo({ fundId: bfId as string }))
    }
  }, [dispatch, bfId])

  // getBfBasicInfo
  return (
    <BfContext.Provider
      value={{
        hasAccess: true
      }}
    >
      {children}
    </BfContext.Provider>
  )
}

export { BfProvider, BfContext }
