'use client'

import { useParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'

// Types
import { DmContextProps } from '@/types/dms'
import { UserContext } from '../user'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

// Project imports
import { useInChatFileUpload } from '@/hooks/useInChatFileUpload'
import { fetchDm, fetchDmsList } from '@/lib/features/dms/dmSlice'

// Initial state
const initialState: DmContextProps = {
  isDragging: false,
  handleDrop: () => {},
  handleDragOver: () => {},
  handleDragLeave: () => {},
  collapsed: {},
  setCollapsed: () => {},
  handleToggleCollapse: () => {},
  setFileUrls: () => {},
  fileUrls: {},
  handleAddFiles: () => {},
  handleRemoveFile: () => {},
  handleClearFiles: () => {},
  showUnread: false,
  setShowUnread: () => {}
}

// ==============================|| NOTIFICATION CONTEXT & PROVIDER ||============================== //

const DmContext = createContext<DmContextProps>(initialState)

type DmProviderProps = {
  children: ReactNode
  
}

function DmProvider ({ children }: DmProviderProps) {
  const isAuthenticated = useContextSelector(
    UserContext,
    (state: any) => state?.isAuthenticated
  )
  const { otherUserId } = useParams()
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({})
  const dispatch = useAppDispatch()
  const dms = useAppSelector(state => state?.dm?.dms)
  const dm = dms?.[otherUserId as string]
  const [showUnread, setShowUnread] = useState(false)

  
  console.log("dm", dm)


  const {
    handleAddFiles,
    handleRemoveFile,
    fileUrls,
    setFileUrls,
    handleClearFiles,
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragLeave
  } = useInChatFileUpload()

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDmsList())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (otherUserId == undefined) return

    if (otherUserId) {
      dispatch(
        fetchDm({
          otherUserId: otherUserId as string
        })
      )
    }
  }, [dispatch, otherUserId])

  const handleToggleCollapse = (id: string) => {
    setCollapsed(prevState => ({
      ...prevState,
      [id]: !prevState?.[id]
    }))
  }

  return (
    <DmContext.Provider
      value={{
        isDragging,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        collapsed,
        setCollapsed,
        handleToggleCollapse,
        fileUrls,
        setFileUrls,
        handleAddFiles,
        handleRemoveFile,
        handleClearFiles,
        showUnread,
        setShowUnread
      }}
    >
      {children}
    </DmContext.Provider>
  )
}

export { DmProvider, DmContext }
