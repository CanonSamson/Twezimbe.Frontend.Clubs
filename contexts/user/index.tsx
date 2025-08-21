'use client'
import React, { useEffect } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'

import Cookies from 'js-cookie'
import { getUser } from '@/api/user'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'
// Define UserContextType explicitly without extending UserState

export interface UserContextType {
  currentUser: User | null
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
  isAuthenticated: boolean | undefined
  setIsAuthenticated: React.Dispatch<React.SetStateAction<undefined | boolean>>
  logout: () => void
  fetchCurrentUser: ({ load }: { load: boolean }) => Promise<void>
  setAllowRedirect: React.Dispatch<React.SetStateAction<boolean>>
  allowRedirect: boolean
}

// Create the UserContext
export const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: true,
  setIsLoading: () => {},
  setCurrentUser: () => {},
  isAuthenticated: undefined,
  setIsAuthenticated: () => {},
  logout: () => {},
  fetchCurrentUser: async () => {},
  allowRedirect: true,
  setAllowRedirect: () => {}
})

// Custom hook for consuming the context
export const useUser = <T = UserContextType>({
  selector
}: {
  selector?: (state: UserContextType) => T
}) => {
  const context = useContextSelector(UserContext, state =>
    selector ? selector(state as UserContextType) : (state as UserContextType)
  )
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [allowRedirect, setAllowRedirect] = React.useState<boolean>(true)  
  const [isAuthenticated, setIsAuthenticated] = React.useState<
    undefined | boolean
  >(undefined)
  const token = Cookies.get('access-token')

  const router = useRouter()


  const fetchCurrentUser = async ({ load = true }: { load: boolean }) => {
    const token = Cookies.get('access-token')
    try {
      if (load) setIsLoading(true)
      if (!token) {
        setIsAuthenticated(false)
        setCurrentUser(null)
        return
      }
      const response = await getUser()
      const userData = response?.data?.user as User
      setCurrentUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      console.log('Failed to fetch user:', error)
      setCurrentUser(null)
      setIsAuthenticated(false)
    } finally {
      if (load) setIsLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchCurrentUser({ load: false })
    }
  }, [token])

  useEffect(() => {
    fetchCurrentUser({ load: true })
  }, [])

  const logout = () => {
    Cookies.remove('access-token')
    setCurrentUser(null)
    setIsAuthenticated(false)
    router.replace('/login')
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        setIsLoading,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        fetchCurrentUser,
        allowRedirect,
        setAllowRedirect
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
