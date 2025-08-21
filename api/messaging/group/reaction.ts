import axiosServices from '@/utils/axios'

export const getUnreadChannelMessageCounts = async (): Promise<{
  data: {
    success: boolean
    readChanels: Record<string, boolean> | undefined
    message: string
  }
}> => {
  return await axiosServices.get(
    '/v1/messaging/group/message/user/unread-channel-message-counts'
  )
}

export const addReaction = async (
  messageId: string,
  data: { emoji: string; groupId: string; channelId: string }
): Promise<{
  data: {
    success: boolean
    message: string
  }
}> => {
  return await axiosServices.post(
    `/v1/messaging/group/message/message-reaction/${messageId}/react`,
    { ...data }
  )
}

export const removeReaction = async (
  messageId: string,
  data: {
    emoji: string
    groupId: string
    channelId: string
    reactionId: string
  }
): Promise<{
  data: {
    success: boolean
    message: string
  }
}> => {
  return await axiosServices.delete(
    `/v1/messaging/group/message/message-reaction/${messageId}/delete-react`,
    { data }  // Wrap the data in a config object
  )
}

export const getMessageReactions = async (
  messageId: string
): Promise<{
  data: {
    success: boolean
    reactions: Array<{
      userId: string
      reaction: string
      createdAt: string
    }>
    message: string
  }
}> => {
  return await axiosServices.get(
    `/v1/messaging/group/message-reaction/${messageId}/reactions`
  )
}
