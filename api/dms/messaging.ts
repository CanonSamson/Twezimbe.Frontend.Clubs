import axiosServices from '@/utils/axios'
import { MessagesPagination } from '../messaging/group'

export type DmMessageType = {
  id: string
  createdAt: string
  text: string
  event?: string
  files?: {
    name: string
    size: number
    url: string
    type: string
  }[]
  edited: boolean
  user: {
    id: string
    profile: {
      firstName: string
      lastName: string
      profileImage: string
      userName: string
    }
  }
  messageRead?: {
    [userIds: string]: boolean
  }
  replyMessage?: {
    id: string
    userId: string
    text: string
    voice: null
    event: null
    replyMessageId: null
    conversationId: string
    files: []
    reactions: []
    createdAt: string
    updatedAt: string
    senderId: string
    receiverId: string
    user: {
      id: string
      profile: {
        firstName: string
        lastName: string
        profileImage: string
        userName: string
      }
    }
    type: string
  }
  messageReaction?: Array<{
    id: string
    messageId: string
    userId: string
    emoji: string
    createdAt: string
  }>
  pinned?: any[]
  senderId: string
  receiverId: string
  conversationId: string
}

export type DmMessageBody = {
  type: 'TEXT'
  text: string
  files:
    | {
        url: string
        id: string
        file: File | null
        uploading: boolean
        completed: boolean
        name: string
        size: number
        type: string
      }[]
    | null
  replyMessage?: DmMessageBody | undefined
  messageId?: string
  id: string
  replyMessageId?: string | undefined
  user: {
    id: string | null | undefined
    profile: {
      firstName: string
      lastName: string
      userName: string
      profileImage: string
    }
  }
  conversationId: string | null
  senderId: string
  receiverId: string
}

export type DmMessageInReplyType = {
  dmId: string
  message: DmMessageBody
}

export type DmMessagesResponse = {
  data: {
    success: boolean
    messages: DmMessageType[]
    pagination: MessagesPagination
    message: string
  }
}

export const sendDmMessage = async (
  body: DmMessageBody
): Promise<DmMessagesResponse> => {
  return await axiosServices.post(`/v1/messaging/dm/send`, body)
}

export const editDmMessage = async (
  conversationId: string,
  body: DmMessageBody
): Promise<DmMessagesResponse> => {
  return await axiosServices.put(
    `/v1/messaging/dm/message/${conversationId}/edit`,
    body
  )
}

export const deleteDmMessage = async (
  messageId: string
): Promise<DmMessagesResponse> => {
  return await axiosServices.delete(
    `/v1/messaging/dm/message/${messageId}/delete`
  )
}
