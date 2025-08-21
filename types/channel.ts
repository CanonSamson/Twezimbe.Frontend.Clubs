export type ChannelType = {
  id: string
  name: string
  type: 'TEXT'
  privacy: 'PUBLIC' | 'PRIVATE'
  createdAt: string
  updatedAt: string
  deleted?: boolean
}
