import axiosServices from '@/utils/axios'
import { GroupChannelMemberType } from '../group'
import { AnyARecord } from 'dns'

export type CreateChannelDTO = {
  name: string
  type: 'TEXT'
  privacy: 'PUBLIC' | 'PRIVATE'
  groupId: string
}
export type UpdateChannelDTO = {
  name?: string
  type?: 'TEXT'
  privacy?: 'PUBLIC' | 'PRIVATE'
  groupId?: string
  topic?: string
  description?: string
}

export type Channel = {
  id: string
  name: string
  type: 'TEXT'
  privacy: 'PUBLIC' | 'PRIVATE'
  groupId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type CreateChannelResponse = {
  success: boolean
  channel: Channel
  message: string
}
export type DeleteChannelResponse = {
  success: boolean
  message: string
  generalChannel: {
    id: string
  },
  channel: {
    id: string
  }
}

export const createChannel = async (
  data: CreateChannelDTO
): Promise<{ data: CreateChannelResponse }> => {
  return await axiosServices.post(
    `/v1/tenancy/group/${data.groupId}/channels/create`,
    data
  )
}


export const deleteChannel = async (
  channelId: string
): Promise<{ data: DeleteChannelResponse }> => {
  return await axiosServices.delete(`/v1/tenancy/channel/${channelId}/delete`)
}

export const sendChannelRequest = async (
  channelId: string,
  groupId: string
): Promise<{ data: CreateChannelResponse }> => {
  return await axiosServices.post(
    `/v1/tenancy/channel/${channelId}/${groupId}/request`
  )
}

export const updateChannelDetails = async (
  channelId: string,
  data: UpdateChannelDTO
): Promise<{ data: CreateChannelResponse }> => {
  return await axiosServices.put(
    `/v1/tenancy/channel/${channelId}/update`,
    data
  )
}

export const acceptChannelRequest = async (
  requestId: string
): Promise<{ data: CreateChannelResponse }> => {
  return await axiosServices.put(
    `/v1/tenancy/channel/request/${requestId}/accept`
  )
}
export const declineChannelRequest = async (
  requestId: string
): Promise<{ data: CreateChannelResponse }> => {
  return await axiosServices.put(
    `/v1/tenancy/channel/request/${requestId}/decline`
  )
}



export const sendChannelInvite = async (
  channelId: string,
  groupId: string,
  data: { receiverId: string }
): Promise<{ data: CreateChannelResponse }> => {
  return await axiosServices.post(
    `/v1/tenancy/channel/${channelId}/${groupId}/invite`, data
  )
}



export const acceptChannelInvite = async (
  inviteId: string
): Promise<{
  invite: {
    id: string;
    groupId: string | null;
    fundId: string | null;
    senderId: string;
    channelId: string | null;
    type: string;
    status: string;
    receiverId: string | null;
    createdAt: Date;
    updatedAt: Date;
    meta: AnyARecord | null;
  }

}> => {
  return await axiosServices.put(
    `/v1/tenancy/channel/invite/${inviteId}/accept`
  )


}



export const getUserChannelInvite = async (
  channelId: string
): Promise<{
  data: {
    invite: {
      userId?: string | undefined;
      firstName?: string | undefined;
      userName?: string | null | undefined;
      lastName?: string | undefined;
      profileImage?: string | null | undefined;
      status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
      id: string | undefined;
      channelId: string | undefined;
    }
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/channel/invite/${channelId}/user-invite`
  )


}
export const declineChannelInvite = async (
  inviteId: string
): Promise<{
  invite: {
    id: string;
    groupId: string | null;
    fundId: string | null;
    senderId: string;
    channelId: string | null;
    type: string;
    status: string;
    receiverId: string | null;
    createdAt: Date;
    updatedAt: Date;
    meta: any | null;
  }
}> => {
  return await axiosServices.put(
    `/v1/tenancy/channel/invite/${inviteId}/decline`
  )
}

export type ChannelRequest = {
  id: string
  groupId: string
  createdAt: string
  channelId: string
  senderId: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  updatedAt: string
  sender: {
    id: string
    profile: {
      firstName: string
      lastName: string
      profileImage: string
      userName: string
    }
  }
}

export type ChannelRequestsResponse = {
  requests: ChannelRequest[]
  success: boolean
  message?: string
}

// Update the function return type
export const getChannelRequests = async (
  channelId: string
): Promise<{ data: ChannelRequestsResponse }> => {
  return await axiosServices.get(`/v1/tenancy/channel/${channelId}/requests`)
}

export type PotentialMembersResponse = {
  members: Array<{
    id: number
    userId: string
    groupId: string
    user: {
      id: string
      isKyc: boolean
      profile: {
        id: string
        firstName: string
        lastName: string
        profileImage: string
        userName: string
      }
    }
    roles: Array<{
      permission: string
    }>
  }>
  pagination: {
    totalMembers: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
  success: boolean
}

// Update the function return type
export const getPotentialChannelMembers = async (
  channelId: string,
  groupId: string
): Promise<{ data: PotentialMembersResponse }> => {
  return await axiosServices.get(
    `/v1/tenancy/channel/${channelId}/${groupId}/potential-members`
  )
}

export type GroupChannelMembersResponse = {
  data: {
    success: boolean
    members: GroupChannelMemberType[]
    pagination: {
      totalMembers: number
      totalPages: number
      currentPage: number
      pageSize: number
    }
    message: string
  }
}


export const getGroupChannelMembers = async (
  groupId: string,
  channelId: string,
  params: { [key: string]: any }
): Promise<GroupChannelMembersResponse> => {
  return await axiosServices.get(`/v1/tenancy/group/${groupId}/${channelId}/members`, { params })
}