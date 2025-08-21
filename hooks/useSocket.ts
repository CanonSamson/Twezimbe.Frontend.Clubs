import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { Socket } from 'socket.io-client'
import io from 'socket.io-client'
import { UserContext } from '@/contexts/user'
import { useContextSelector } from 'use-context-selector'

export const dynamic = 'force-dynamic' // Ensure this page is always server-rendered
export function useSocket() {
  const socket = useRef<Socket | null>(null)
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  )
  const isAuthenticated = useContextSelector(
    UserContext,
    (state: any) => state.isAuthenticated
  )
  const isLoading = useContextSelector(
    UserContext,
    (state: any) => state.isLoading
  )

  const token = Cookies.get('access-token')
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    // Cleanup previous connection
    if (socket.current) {
      console.log('Cleaning up previous socket connection')
      socket.current.disconnect()
      socket.current.removeAllListeners()
      socket.current = null
    }

    console.log('Socket connection attempt:', {
      isAuthenticated,
      isLoading,
      userId: currentUser?.id,
      hasToken: !!token
    })

    if (isAuthenticated === undefined || isLoading) {
      console.log('Auth not ready or loading, skipping socket connection')
      return
    }
    if (!currentUser?.id) {
      console.log('No user ID available, disconnecting')
      setIsConnected(false)
      return
    }

    // Initialize the socket connection
    try {
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_API_URL || 'https://client-api.twezimbe.com', {
        path: '/ws/',
        query: { userId: currentUser?.id, token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        forceNew: true, // Force a new connection
        transports: ['websocket'] // Try websocket first
      })

      // Event listener for connection
      socket.current.on('connect', () => {
        setIsConnected(true)
        console.warn('SOCKET CONNECTED!', socket.current?.id)
      })

      // Event listener for connection error
      socket.current.on('connect_error', error => {
        console.error('Socket connection error:', error)
      })

      // Event listener for disconnection
      socket.current.on('disconnect', reason => {
        setIsConnected(false)
        console.warn('SOCKET DISCONNECTED! Reason:', reason)
      })

      return () => {
        if (socket.current) {
          console.log('Cleaning up socket connection')
          socket.current.disconnect()
          socket.current.removeAllListeners()
        }
      }
    } catch (error) {
      console.error('Error initializing socket:', error)
    }

    return () => {
      if (socket.current) {
        console.log('Cleaning up socket connection')
        socket.current.disconnect()
        socket.current.removeAllListeners()
      }
    }
  }, [currentUser?.id, isAuthenticated, isLoading, token]) // Added token to dependencies

  const connect = () => {
    console.log('Attempting to reconnect socket...')
    if (socket.current && !socket.current.connected) {
      console.log('Socket exists but not connected, initiating connection...')
      socket.current.connect()
      console.log('Connection attempt initiated')
    } else {
      console.log('Socket already connected or not initialized')
    }
  }

  return {
    isConnected,
    connect,
    socket: socket?.current
  }
}
