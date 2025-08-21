import { RecommendedGroupType } from '@/types/groups'
import axiosServices from '@/utils/axios'

export type MessageType = {
  id: string
  createdAt: string
  text: string
  system: boolean
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
    id: string
    messageId: string
    userId: string
    isRead: boolean
    groupId: string
    channelId: string
    readAt: string | null
  } | null
  replyMessage?: {
    id: string
    channelId: string
    groupId: string
    userId: string
    text: string
    voice: null
    event: null
    replyMessageId: null
    conversationId: null
    files: []
    reactions: []
    createdAt: string
    updatedAt: string
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
    system: boolean
  }
  messageReaction?: Array<{
    id: string
    messageId: string
    userId: string
    emoji: string
    createdAt: string
  }>
  pinned?: any[]

}




export type MessagesPagination = {
  totalMembers: number
  totalPages: number
  currentPage: number
  pageSize: number
  page: number
  totalCount: number
  hasMorePage: boolean
  cursor?: string | null
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type GroupMessagesResponse = {
  data: {
    success: boolean
    messages: MessageType[]

    pagination: MessagesPagination
    message: string
  }
}

export type RecommendedGroupChannelResponse = {
  data: {
    success: boolean
    groupName: string
    groups: RecommendedGroupType[]
    pagination: {
      page: string
    }
    message: string
  }
}

export const getChannelMessages = async (
  groupId: string,
  channelId: string,
  params?: { [key: string]: any }
): Promise<GroupMessagesResponse> => {
  return await axiosServices.get(
    `/v1/messaging/group/message/${groupId}/channel/${channelId}/messages`,
    { params }
  )
}

export const searchGroupMessages = async (
  groupId: string,
  params?: { [key: string]: any }
): Promise<GroupMessagesResponse> => {
  return await axiosServices.get(
    `/v1/messaging/group/message/${groupId}/search`,
    { params }
  )
}

export type MessageBody = {
  type: 'TEXT';
  text: string;
  files: {
    url: string;
    id: string;
    file: File | null;
    uploading: boolean;
    completed: boolean;
    name: string;
    size: number;
    type: string;
  }[] | null;
  replyMessage?: MessageType | undefined;
  messageId?: string;
  id: string;
  replyMessageId?: string | undefined;
  user: {
    id: string | null | undefined;
    profile: {
      firstName: string;
      lastName: string;
      userName: string;
      profileImage: string;
    };
  };
  channelId: string;
  groupId: string;
  userId: string;
};


export const sendChannelMessage = async (
  groupId: string,
  channelId: string,
  body: MessageBody
): Promise<GroupMessagesResponse> => {
  return await axiosServices.post(
    `/v1/messaging/group/message/${groupId}/channel/${channelId}/send`,
    body
  )
}



export const editChannelMessage = async (
  groupId: string,
  channelId: string,
  body: MessageBody
): Promise<GroupMessagesResponse> => {
  return await axiosServices.put(
    `/v1/messaging/group/message/${groupId}/channel/${channelId}/edit`,
    body
  )
}
export const deleteChannelMessage = async (
  groupId: string,
  channelId: string,
  data: {
    messageId: string
  }
): Promise<GroupMessagesResponse> => {
  return await axiosServices.delete(
    `/v1/messaging/group/message/${groupId}/channel/${channelId}/delete`,
    { data }
  )
}


export type FileBody = {
  data: {
    success: boolean
    url: string
    message: string
  }
}

export type UploadImage = {
  data: FileBody
}
