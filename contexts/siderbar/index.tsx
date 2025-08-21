'use client'

import { usePathname } from 'next/navigation'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from 'react'

interface SiderBarContextType {
  handleCloseSiderBar: () => void
  handleOpenSiderBar: () => void
  siderWidth: number
  sideBarCloseButton: boolean
  setSiderWidth: React.Dispatch<React.SetStateAction<number>>
  hidden: boolean
}

const SiderBarContext = createContext<SiderBarContextType | undefined>(
  undefined
)

export function useSiderBar () {
  const context = useContext(SiderBarContext)
  if (!context) {
    throw new Error('useSiderBar must be used within a SideBarProvider')
  }
  return context
}

interface SideBarProviderProps {
  children: React.ReactNode
}

export function SideBarProvider ({ children }: SideBarProviderProps) {
  const [sideBarCloseButton, setSideBarCloseButton] = useState(true)
  const [siderWidth, setSiderWidth] = useState(300)
  const pathname = usePathname()

  const hidden = useMemo(
    () =>
      pathname.includes('/join/') ||
      pathname.includes('/bf/settings') ||
      (pathname.includes('/clubs/') && pathname.includes('/settings')),
    [pathname]
  )

  const shouldClose = useMemo(
    () =>
      pathname.includes('/groups') ||
      pathname.includes('/settings') ||
      pathname.includes('/bf/') ||
      pathname.includes('/dms/') ||
      pathname.includes('/cases/') ||
      pathname.includes('/clubs/'),
    [pathname]
  )
  const updateSidebarWidth = (width: number) => {
    const sidebar = document.querySelector(
      '.resize-sidebar-current'
    ) as HTMLElement | null
    if (sidebar) sidebar.style.width = `${width}px`
  }

  const handleCloseSiderBar = () => {
    setSiderWidth(80)
    setSideBarCloseButton(false)
  }

  const handleOpenSiderBar = () => {
    setSiderWidth(300)
    setSideBarCloseButton(true)
  }

  useEffect(() => {
    if (!hidden) {
      updateSidebarWidth(siderWidth)
    }
  }, [siderWidth, hidden, pathname])

  useEffect(() => {
    if (hidden) return

    if (shouldClose && siderWidth > 80) {
      handleCloseSiderBar()
    } else if (!shouldClose && siderWidth < 300) {
      handleOpenSiderBar()
    }
  }, [pathname])

  return (
    <SiderBarContext.Provider
      value={{
        handleCloseSiderBar,
        handleOpenSiderBar,
        siderWidth,
        sideBarCloseButton,
        setSiderWidth,
        hidden
      }}
    >
      {children}
    </SiderBarContext.Provider>
  )
}
