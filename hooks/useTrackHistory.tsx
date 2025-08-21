'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const useTrackHistory = () => {
  const pathname = usePathname()
  const prevPathRef = useRef<null | string>(null)

  useEffect(() => {
    // Store initial path
    window.history.replaceState({ prevUrl: null }, '')

    const handleRouteChange = () => {
      const currentUrl = pathname
      const prevUrl = window.history.state?.prevUrl

      // Check if the new path has a similar start as the previous one
      if (!prevUrl || !currentUrl.includes('settings')) {
        window.history.replaceState({ prevUrl: currentUrl }, '')
        prevPathRef.current = currentUrl
      }
    }

    // Add event listener for navigation
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [pathname])

  return {
    getPreviousPath: () => prevPathRef.current || '/'
  }
}
