import { BasicUserBfType } from '@/api/group'

export type Group = {
  id: string
  name: string
  tags: string[]
  description: string
}

export type GroupRole = 'OWNER' | 'ADMIN' | 'USER'
export type GroupTypeTypes =
  | 'Education'
  | 'Social'
  | 'Professional'
  | 'Healthcare'
  | 'Others'

export type NewInputGroupType = {
  name: string
  tags: string[]
  type: string
  privacy: string
  description: string
  currency: string
  coverImage?: File
  iconImage?: File
}

export type UserGroupListType = {
  iconImage: string | null
  name: string
  id: string
  channels: {
    id: string
  }[]
  roles: {
    permission: GroupRole
  }[]
  firstChannelId: string
  unSeenCount: number
}

export type GroupChannelListType = {
  name: string
  id: string
  type: string
  privacy: 'PUBLIC' | 'PRIVATE'
}

export type RecommendedGroupType = {
  description: string
  iconImage: string
  memberCount: number
  coverImage: string
} & GroupChannelListType

export type GroupContextProps = {
  hasAccess: boolean
  isDragging: boolean
  handleDrop: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  setCollapsed: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
  collapsed: { [key: string]: boolean }
  handleToggleCollapse: (id: string) => void
  handleAddFiles: (files: File[]) => void
  handleRemoveFile: (id: string) => void
  handleClearFiles: () => void
  canDeleteGroup: boolean
  isChannelAdmin: boolean
  fileUrls: {
    [key: string]: {
      url: string
      id: string
      file: File | null
      uploading: boolean
      completed: boolean
      name: string
      size: number
      type: string
    }
  }
  setFileUrls: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        url: string
        id: string
        file: File | null
        uploading: boolean
        completed: boolean
        name: string
        size: number
        type: string
      }
    }>
  >
}

export type AllGroupDataType = {
  iconImage?: string | null
  name?: string
  description?: string
  id?: string
  channels?: {
    id: string
    name?: string
    privacy?: 'PUBLIC' | 'PRIVATE'
  }[]
  roles: GroupRole[]
  channel?: {
    name?: string
    id?: string
    privacy?: 'PUBLIC' | 'PRIVATE'
  }
}

export type GroupDataType = {
  id: string
  name: string
  channels: {
    type: string
    id: string
    name: string
    privacy: string
    createdAt: Date
    updatedAt: Date
  }[]
  roles: {
    permission: GroupRole
  }[]
  description: string | null
  iconImage: string | null
  coverImage: string
}

export type ChannelType = {
  type: string
  id: string
  name: string
  privacy: 'PUBLIC' | 'PRIVATE'
  createdAt: Date
  updatedAt: Date
  access: boolean
  role: Array<{
    permissions: Array<'VIEW' | 'CHAT' | 'ADMIN'>
  }>
  request: {
    id: string
    status: string
  } | null
  description?: string | null
  topic?: string | null
  canDelete?: boolean
}

export type GroupType = {
  id: string
  name: string
  invitedMemberCount?: number
  invitedAdminCount?: number
  type?: string
  status?: string
  tags?: string[]
  createdAt?: Date
  createdBy?: {
    name: string
  }
  channels: ChannelType[]
  bereavementFunds: BasicUserBfType[]
  crowdfunding: Array<{id: string; name: string}>
  roles: GroupRole[]
  description: string | null
  iconImage: string | null
  coverImage: string
  memberSettings?: {
    mute: boolean
    notifications: any
  }
}
export type BFRole =
  | 'OWNER'
  | 'ADMIN'
  | 'USER'
  | 'PRINCIPAL'
  | 'SUPERVISOR'
  | 'MANAGER'
  | 'TREASURER'

// DMS Types
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO'

export type DmMessage = {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  text: string
  files: string[]
  replyMessageId: string | null
  createdAt: string
  updatedAt: string
  type: MessageType
  editedAt: string | null
  edited: boolean
  readReceipts: Record<string, any>
}

export type DmUser = {
  id: string
  firstName: string
  lastName: string
  userName: string | null
  profileImage: string | null
}

export type DmConversation = {
  id: string
  user1Id: string
  user2Id: string
  otherUserId: string
  unreadCount: number
  lastMessage: DmMessage
  otherUser: DmUser
  updatedAt: string
  createdAt: string
}

export type DmPagination = {
  currentPage: number
  pageSize: number
  totalCount: number
  hasMore: boolean
}

export type DmsListData = {
  conversations: DmConversation[]
  pagination: DmPagination
}

export type DmsListResponse = {
  success: boolean
  data: DmsListData
}

export type OtherUserType = {
  userId: string
  userName: string
  firstName: string
  lastName: string
  profileImage: string | null
}
export type DmDetailsType =
  | {
      id?: string
      conversationStarted: boolean
      otherUser: OtherUserType
      users?: { [userId: string]: boolean }
      topics?: { [userId: string]: string }
      createdAt?: Date
      updatedAt?: Date
    }
 

export type GetDmResponse = {
  data: {
    success: boolean
    conversation: DmDetailsType
  }
}
export type GetDmDetailsResponse = {
  data: {
    conversation: DmDetailsType
  } & { success: true }
}

export type GroupDmConversation = {
  id: string
  otherUserId: string
  otherUser: {
    id: string
    firstName: string
    lastName: string
    username: string
    profileImage: string | null
  }
}

export type GroupDmsListResponse = {
  data: {
    conversations: GroupDmConversation[]
    createdAt: string
    updatedAt: string
    groupId: string
    totalMembers: number
    conversationsFound: number
    success: boolean
  }
}

export type DmContextProps = {
  isDragging: boolean
  handleDrop: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  setCollapsed: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
  collapsed: { [key: string]: boolean }
  handleToggleCollapse: (id: string) => void
  handleAddFiles: (files: File[]) => void
  handleRemoveFile: (id: string) => void
  handleClearFiles: () => void
  fileUrls: {
    [key: string]: {
      url: string
      id: string
      file: File | null
      uploading: boolean
      completed: boolean
      name: string
      size: number
      type: string
    }
  }
  setFileUrls: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        url: string
        id: string
        file: File | null
        uploading: boolean
        completed: boolean
        name: string
        size: number
        type: string
      }
    }>
  >
  showUnread: boolean
  setShowUnread: React.Dispatch<React.SetStateAction<boolean>>
}
