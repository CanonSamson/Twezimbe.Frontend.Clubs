import { DmMessageType } from '@/api/dms/messaging'
import {
  MessageBody,
  MessageType,
  MessagesPagination
} from '@/api/messaging/group'
import axiosServices from '@/utils/axios'

// Direct Message Types
export interface DMConversation {
  id: string
  participants: DMParticipant[]
  lastMessage?: MessageType
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface DMParticipant {
  id: string
  userId: string
  conversationId: string
  joinedAt: string
  user: {
    id: string
    profile: {
      firstName: string
      lastName: string
      userName: string
      profileImage: string
    }
  }
}

export interface DMSendMessageData {
  conversationId: string
  body: MessageBody
}

export interface DMCreateConversationData {
  participantIds: string[]
  initialMessage?: {
    text: string
    files?: {
      url: string
      name: string
      size: number
      type: string
    }[]
  }
}

export interface DMSearchParams {
  query: string
  limit?: number
  offset?: number
  before?: string
  after?: string
}

export interface DMMessageParams {
  limit?: number
  offset?: number
  before?: string
  after?: string
  cursor?: string
}

export interface DMEditMessageData {
  text: string
  files?: {
    url: string
    name: string
    size: number
    type: string
  }[]
}

// API Response Types
export interface DMApiResponse<T = any> {
  data: {
    success: boolean
    message: string
    data?: T
  }
}

export type DMConversationsResponse = DMApiResponse<DMConversation[]>

export type DMConversationResponse = DMApiResponse<DMConversation>

export type DMMessagesResponse = {
  data: {
    messages: DmMessageType[]
    pagination: MessagesPagination
  }
}

export type DMParticipantsResponse = DMApiResponse<DMParticipant[]>

export type DMSearchResponse = DMApiResponse<{
  messages: DmMessageType[]
  pagination: MessagesPagination
}> 

export type DMUnreadCountResponse = DMApiResponse<{ count: number }>

export type DMMessageResponse = DMApiResponse<DmMessageType>

// Direct Message Routes

// Send a message
export const sendMessage = async (
  data: DMSendMessageData
): Promise<DMMessageResponse> => {
  return await axiosServices.post('/v1/messaging/dm/send', data)
}

// Get user conversations
export const getUserConversations =
  async (): Promise<DMConversationsResponse> => {
    return await axiosServices.get('/v1/messaging/dm/conversations')
  }

// Get or create conversation
export const getOrCreateConversation = async (
  data?: DMCreateConversationData
): Promise<DMConversationResponse> => {
  return await axiosServices.post('/v1/messaging/dm/conversations', data)
}

// Get conversation by ID
export const getConversationById = async (
  conversationId: string
): Promise<DMConversationResponse> => {
  return await axiosServices.get(
    `/v1/messaging/dm/conversations/${conversationId}`
  )
}

// Get conversation messages
export const getConversationMessages = async (
  otherUserId: string,
  params?: DMMessageParams
): Promise<DMMessagesResponse> => {
  return await axiosServices.get(
    `/v1/messaging/dm/conversations/other-user/${otherUserId}/messages`,
    { params }
  )
}

// Get conversation participants
export const getConversationParticipants = async (
  conversationId: string
): Promise<DMParticipantsResponse> => {
  return await axiosServices.get(
    `/v1/messaging/dm/conversations/${conversationId}/participants`
  )
}

// Search messages in conversation
export const searchMessages = async (
  conversationId: string,
  params: DMSearchParams
): Promise<DMSearchResponse> => {
  return await axiosServices.get(
    `/v1/messaging/dm/conversations/${conversationId}/search`,
    { params }
  )
}

// Mark conversation as read
export const markConversationAsRead = async (
  conversationId: string
): Promise<DMApiResponse> => {
  return await axiosServices.put(
    `/v1/messaging/dm/conversations/${conversationId}/read`
  )
}

// Mark message as read
export const markMessageAsRead = async (
  messageId: string
): Promise<DMApiResponse> => {
  return await axiosServices.put(`/v1/messaging/dm/${messageId}/read`)
}

// Edit message
export const editMessage = async (
  messageId: string,
  data: DMEditMessageData
): Promise<DMMessageResponse> => {
  return await axiosServices.put(`/v1/messaging/dm/${messageId}`, data)
}

// Delete message
export const deleteMessage = async (
  messageId: string
): Promise<DMApiResponse> => {
  return await axiosServices.delete(`/v1/messaging/dm/${messageId}`)
}

// Get unread count
export const getUnreadCount = async (): Promise<DMUnreadCountResponse> => {
  return await axiosServices.get('/v1/messaging/dm/unread-count')
}
