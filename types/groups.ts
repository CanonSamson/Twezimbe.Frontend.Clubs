import { BasicUserBfType } from '@/api/group'

export type GroupRecommendedType = {
  id: string // Unique identifier for the group
  name: string // Name of the group
  description: string // Description of the group
  image: string // URL of the group's image
  membersCount: number // Total members in the group
  membersOnline: number // Members currently online
  status: 'PUBLIC' | 'PRIVATE' // Visibility status of the group
}

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

export type BasicClubType = {
  id: string
  name: string
  description: string
  roles: Array<{
    permission: 'ADMIN'
  }>
  memberSettings?: null
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
  clubs: BasicClubType[]
  channels: ChannelType[]
  bereavementFunds: BasicUserBfType[]
  crowdfunding: Array<{ id: string; name: string }>
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
