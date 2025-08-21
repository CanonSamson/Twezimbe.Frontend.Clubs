'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import GroupList from './GroupList'

const CommunityList = () => {
  const [siderWidth, setSiderWidth] = useState(400)

  const pathName = usePathname()

  const [transition, setTransition] = useState(true)

  let handle = document?.querySelector('.resize-handle1') as HTMLElement | null
  let sidebar = document?.querySelector(
    '.resize-current1'
  ) as HTMLElement | null
  const [change, setChange] = useState(true)

  useEffect(() => {
    handle = document?.querySelector('.resize-handle1') as HTMLElement | null
    sidebar = document?.querySelector('.resize-current1') as HTMLElement | null
    setChange(!change)
  }, [pathName])

  useEffect(() => {
    handle = document?.querySelector('.resize-handle1') as HTMLElement | null
    sidebar = document?.querySelector('.resize-current1') as HTMLElement | null
    if (!handle || !sidebar) {
      return
    }
    let isResizing = false
    // let lastDownX = 0;

    handle.addEventListener('mousedown', () => {
      isResizing = true
      // lastDownX = e.clientX || 0;
      setTransition(false)
    })

    document?.addEventListener('mousemove', e => {
      if (!isResizing) return
      const width = e.clientX - 300
      if (sidebar)
        if (width > 400) {
          setSiderWidth(400)
          sidebar.style.width = `${400}px`
        } else if (width > 80) {
          setSiderWidth(width)
          sidebar.style.width = `${width}px`
        } else {
          setSiderWidth(80)
          sidebar.style.width = `${80}px`
        }
    })

    document?.addEventListener('mouseup', () => {
      isResizing = false
      setTransition(true)
    })

    return () => {
      document?.removeEventListener('mousemove', () => {})
      document?.removeEventListener('mouseup', () => {})
    }
  }, [change])

  if (
    pathName.includes(`/join/`) ||
    (pathName.includes('/clubs/') && pathName.includes('/settings'))
  )
    return

  return (
    <>
      {pathName.includes('/chats') ? (
        <div
          className={`w-[400px] min-h-[100dvh] overflow-x-auto tablet-lg:block hidden resize-current1 justify-center bg-[#88B7D8] h-full flex-none prevent-select ${
            siderWidth < 150 ? 'px-[10px]' : 'px-[30px]'
          } pt-[50px] relative ${
            transition ? 'transition-[width] duration-200' : 'transition-none'
          }`}
        />
      ) : pathName === '/dms' ? null : (
        <GroupList />
      )}
    </>
  )
}

export default CommunityList
