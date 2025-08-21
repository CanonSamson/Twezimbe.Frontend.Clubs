import {
  GroupChannelListType,
  GroupRole,
  RecommendedGroupType,
  UserGroupListType
} from '@/types/groups'
import axiosServices from '@/utils/axios'

export type CreateGroupDTO = {
  name: string
  tags: string[]
  type: string
  status: string
  description: string
  coverUrl?: string
  iconUrl?: string
}

export type UpdateGroupDTO = {
  groupId: string
  name?: string
  tags?: string[]
  type?: string
  status?: string
  description?: string
  coverUrl?: string
  iconUrl?: string
}

export type UpdateGroupMemberSettingsDTO = {
  settings: {
    notifications?: any
    mute?: boolean
  }
}

export type CreateGroupResponse = {
  data: {
    success: boolean
    groupId: string
    generalChannelId: string
    message: string
  }
}
export type UploadImageResponse = {
  data: {
    success: boolean
    url: string
    message: string
  }
}

export type Roles = {
  roles: 'OWNER' | 'ADMIN' | 'USER'[]
}
export type UserGroupListResponse = {
  data: {
    success: boolean
    groups: UserGroupListType[] & Roles
    message: string
  }
}

export type GroupChannelListResponse = {
  data: {
    success: boolean
    groupName: string
    channels: GroupChannelListType[] & Roles
    message: string
    access: boolean
  }
}

export type JoinGroupResponse = {
  data: {
    success: boolean
    groupId: string
    generalChannelId: string
    message: string
  }
}
export type LeaveGroupResponse = {
  data: {
    success: boolean
    groupId: string
    generalChannelId: string
    message: string
  }
}
export type GroupMemberType = {
  roles: {
    permission: 'ADMIN' | 'USER'
  }[]
  userId: string
  groupId: string
  user: {
    id: string
    profile: {
      firstName: string
      lastName: string
      profileImage: string
      userName: string | null
    }
  }
}
export type GroupChannelMemberType = {
  permissions: string[]
  userId: string
  groupId: string
  user: {
    id: string
    profile: {
      firstName: string
      lastName: string
      profileImage: string
      userName: string | null
    }
  }
}
export type GroupMembersResponse = {
  data: {
    success: boolean
    members: GroupMemberType[]
    pagination: {
      totalMembers: number
      totalPages: number
      currentPage: number
      pageSize: number
    }
    message: string
  }
}

export type BasicUserBfType = {
  id: string
  name: string
  fundDetails: string
  type: string
  roles: { permission: string }[]
  request: {
    id: string
    status: string
  } | null
  transitionMembers:
    | { id: string; paymentStatus: string; status: string }[]
    | null
  wallets: {
    id: string
    fundId: string
    userId: string
    balance: number
  }[]
}

export type GetGroupResponseGroupData = {
  id: string
  name: string
  invitedMemberCount?: number
  invitedAdminCount?: number
  type?: string
  tags?: string[]
  channels: {
    type: string
    id: string
    name: string
    privacy: 'PRIVATE' | 'PUBLIC'
    createdAt: Date
    updatedAt: Date
    access: boolean
    deleted?: boolean
    role: Array<{
      permissions: Array<'VIEW' | 'CHAT' | 'ADMIN'>
    }>
    request: {
      id: string
      status: string
    } | null
  }[]
  roles: {
    permission: GroupRole
  }[]
  clubs: Array<{
    id: string
    name: string
    description: string
    roles: Array<{
      permission: 'ADMIN'
    }>
    memberSettings?: null
  }>
  bereavementFunds: BasicUserBfType[]
  description: string | null
  iconImage: string | null
  coverImage: string
}

export type GroupResponse = {
  data: {
    success: boolean
    group: GetGroupResponseGroupData
    message: string
  }
}

export type GroupRolesResponse = {
  data: {
    success: boolean
    roles: GroupRole[]
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

export const createGroup = async (
  data: CreateGroupDTO
): Promise<CreateGroupResponse> => {
  return await axiosServices.post('/v1/tenancy/group/create', data)
}

export const deleteGroup = async (
  groupId: string
): Promise<CreateGroupResponse> => {
  return await axiosServices.delete(`/v1/tenancy/group//${groupId}/delete`)
}
export const updateGroupDetails = async (
  data: UpdateGroupDTO
): Promise<CreateGroupResponse> => {
  return await axiosServices.put('/v1/tenancy/group/update', data)
}

export const updateGroupMemberSettings = async (
  groupId: string,
  data: UpdateGroupMemberSettingsDTO
): Promise<{
  success: boolean
}> => {
  return await axiosServices.put(
    `/v1/tenancy/group/${groupId}/update-group-settings`,
    data
  )
}

export const updateGroupIconAndCoverImage = async ({
  coverFile,
  iconFile
}: {
  [key: string]: File
}): Promise<CreateGroupResponse> => {
  const formData = new FormData()
  formData.append('coverFile', coverFile)
  formData.append('iconFile', iconFile)
  return await axiosServices.post(
    '/v1/tenancy/upload-file/group/icon-and-cover-image',
    formData
  )
}

export const uploadGroupIconImage = async (
  file: File
): Promise<UploadImageResponse> => {
  if (!file) {
    throw new Error('No file provided.')
  }

  const formData = new FormData()
  formData.append('iconImage', file)
  return await axiosServices.post(
    '/v1/tenancy/upload-file/image/group-icon',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

export const uploadGroupIconCover = async (
  file: File
): Promise<UploadImageResponse> => {
  if (!file) {
    throw new Error('No file provided.')
  }

  const formData = new FormData()
  formData.append('coverImage', file)
  return await axiosServices.post(
    '/v1/tenancy/upload-file/image/group-cover',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

export const getUserGroupList = async (): Promise<UserGroupListResponse> => {
  return await axiosServices.get('/v1/tenancy/group/user/list')
}

export const getUnreadGroupMessageCounts = async (): Promise<{
  data: {
    success: boolean
    counts: Record<string, number> | undefined
    message: string
  }
}> => {
  return await axiosServices.get(
    '/v1/messaging/group/message/user/unread-message-counts'
  )
}

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

export const getGroupChannels = async (
  groupId: string
): Promise<GroupChannelListResponse> => {
  return await axiosServices.get(`/v1/tenancy/group/${groupId}/channels`)
}

export const joinPublicGroup = async (
  groupId: string
): Promise<JoinGroupResponse> => {
  return await axiosServices.post(`/v1/tenancy/group/${groupId}/join-public`)
}

export const leaveGroup = async (
  groupId: string
): Promise<LeaveGroupResponse> => {
  return await axiosServices.post(`/v1/tenancy/group/${groupId}/leave`)
}

export const removeGroupMember = async (
  groupId: string,
  memberUserId: string
): Promise<LeaveGroupResponse> => {
  return await axiosServices.post(
    `/v1/tenancy/group/${groupId}/remove-member/${memberUserId}`
  )
}

export const makeUserAdmin = async (
  groupId: string,
  memberUserId: string
): Promise<{
  data: {
    message: string
    success: boolean
  }
}> => {
  return await axiosServices.post(
    `/v1/tenancy/group/${groupId}/make-admin/${memberUserId}`
  )
}

export const removeAdminMemberRole = async (
  groupId: string,
  memberUserId: string
): Promise<{
  data: {
    message: string
    success: boolean
  }
}> => {
  return await axiosServices.post(
    `/v1/tenancy/group/${groupId}/remove-admin/${memberUserId}`
  )
}

export const getGroupMembers = async (
  groupId: string,
  params: { [key: string]: any }
): Promise<GroupMembersResponse> => {
  return await axiosServices.get(`/v1/tenancy/group/${groupId}/members`, {
    params
  })
}

export const getGroup = async (groupId: string): Promise<GroupResponse> => {
  return await axiosServices.get(`/v1/tenancy/group/get/${groupId}`)
}

export const getTaskStats = async (
  groupId: string
): Promise<{
  data: {
    taskStats: {
      hasInvited: boolean
      hasTwoInvitedAdmins: boolean
      invitedMembersCount: number
      invitedAdminsCount: number
    }
    success: boolean
  }
}> => {
  return await axiosServices.get(`/v1/tenancy/group/${groupId}/task-stats`)
}

export const getChannelMessages = async (
  groupId: string
): Promise<GroupMembersResponse> => {
  return await axiosServices.get(`/v1/tenancy/group/${groupId}/members`)
}
export const getGroupRoles = async (
  groupId: string
): Promise<GroupRolesResponse> => {
  return await axiosServices.get(`/v1/tenancy/group/${groupId}/member/roles`)
}

export const getRecommendedGroups = async (params: {
  [key: string]: any
}): Promise<RecommendedGroupChannelResponse> => {
  return await axiosServices.get(`/v1/tenancy/group/recommended`, { params })
}
