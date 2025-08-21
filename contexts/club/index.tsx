'use client'

import { fetchClubBasicInfo } from '@/lib/features/clubs/clubSlice'
import { useAppDispatch } from '@/lib/hooks'
import { useParams } from 'next/navigation'
import { createContext, ReactNode, useEffect } from 'react'

// Types

interface ClubProviderProps {
  children: ReactNode
}
// Initial state
interface ClubContextProps {
  hasAccess: boolean
}
const initialState: ClubContextProps = {
  hasAccess: true
}

// ==============================|| NOTIFICATION CONTEXT & PROVIDER ||============================== //

const ClubContext = createContext<ClubContextProps>(initialState)

function ClubProvider ({ children }: ClubProviderProps) {
  const dispatch = useAppDispatch()
  const { clubId } = useParams()
  useEffect(() => {
    if (clubId) {
      dispatch(fetchClubBasicInfo({ clubId: clubId as string }))
    }
  }, [dispatch, clubId])

  // getBfBasicInfo
  return (
    <ClubContext.Provider
      value={{
        hasAccess: true
      }}
    >
      {children}
    </ClubContext.Provider>
  )
}

export { ClubProvider, ClubContext }
