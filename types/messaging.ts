import { MessageType } from '@/api/messaging/group'
import { SetStateAction, Dispatch } from 'react'
import { Socket } from 'socket.io-client'

export type MessagingContextProps = {
  setGroupRealTimeData: Dispatch<
    SetStateAction<{
      [key: string]: {
        id: string
      }
    }>
  >
  groupRealTimeData: {
    [key: string]: {
      id: string
    }
  }
  socket: Socket | null
  groupChannelMessagesData: {
    [key: string]: MessageType[] | undefined
  }
  setChannelMessagesData: Dispatch<
    SetStateAction<{
      [key: string]: MessageType[]
    }>
  >
}
