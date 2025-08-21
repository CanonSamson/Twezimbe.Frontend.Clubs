import axiosServices from '@/utils/axios'
import {
  DmsListResponse,
  GetDmDetailsResponse,
  GroupDmsListResponse
} from '@/types/dms'

export const getUserDmsList = async (): Promise<DmsListResponse> => {
  return await axiosServices.get('/v1/messaging/dm/conversations')
}

export const getGroupDmsList = async (
  groupId: string
): Promise<GroupDmsListResponse> => {
  return await axiosServices.get(
    `/v1/messaging/dm/conversations/group/${groupId}`
  )
}

export const getOrCreateDm = async ({
  user2Id
}: {
  user2Id: string
}): Promise<{
  data: {
    success: boolean
    data: {
      id: string
      createdAt: Date
      user1Id: string
      user2Id: string
      updatedAt: Date
    }
  }
}> => {
  return await axiosServices.post(`/v1/messaging/dm/conversations`, {
    user2Id
  })
}

export const getDm = async (
  otherUserId: string
): Promise<GetDmDetailsResponse> => {
  return await axiosServices.get(
    `/v1/messaging/dm/conversation-details/${otherUserId}`
  )
}

export const updateUserConversationTopic = async ({
  conversationId,
  topic
}: {
  conversationId: string
  topic: string
}): Promise<{
  data: {
    success: boolean
    message: string
    data: {
      conversationId: string
      topic: string
      updatedAt: Date
    }
  }
}> => {
  return await axiosServices.put(
    `/v1/messaging/dm/conversations/${conversationId}/topic`,
    {
      topic
    }
  )
}
