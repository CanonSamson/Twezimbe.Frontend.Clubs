import {
  getGroup,
  getUnreadChannelMessageCounts,
  getUnreadGroupMessageCounts,
  getUserGroupList
} from '@/api/group' // Remove getGroupRoles
import { BFRole, GroupType, UserGroupListType } from '@/types/groups' // Remove GroupRole
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  groups: { [groupId: string]: GroupType }
  group: GroupType | undefined
  groupList: UserGroupListType[]
  groupKeys: { [key: string]: string }
  loading: { [key: string]: boolean }
  groupLoadingData: {
    [groupId: string]: boolean
  }
}
// First, add loading state to InitialState
const InitialState: InitialStateProps = {
  group: undefined,
  groups: {},
  groupList: [],
  groupKeys: {},
  loading: {
    fetchGroupList: false,
    fetchUnreadGroupMessageCounts: false,
    fetchUnreadChannelMessageCounts: false,
    fetchGroupRole: false,
    fetchGroup: false
  },
  groupLoadingData: {}
}

export const fetchGroupList = createAsyncThunk(
  'group/fetchGroupList',
  async () => {
    try {
      const response = await getUserGroupList()
      const groups = response?.data.groups
      return groups
    } catch (error) {
      console.error('Failed to fetch fetchGroupList:', error)
      throw error
    } finally {
    }
  }
)

export const fetchUnreadGroupMessageCounts = createAsyncThunk(
  'group/fetchUnreadGroupMessageCounts',
  async () => {
    try {
      const response = await getUnreadGroupMessageCounts()
      const readMessages = response?.data.counts
      return readMessages
    } catch (error) {
      console.error('Failed to fetch fetchUnreadGroupMessageCounts:', error)
      throw error
    } finally {
    }
  }
)

export const fetchUnreadChannelMessageCounts = createAsyncThunk(
  'group/fetchUnreadChannelMessageCounts',
  async () => {
    try {
      const response = await getUnreadChannelMessageCounts()
      const readMessages = response?.data.readChanels
      return readMessages
    } catch (error) {
      console.error('Failed to fetch fetchUnreadChannelMessageCounts:', error)
      throw error
    } finally {
    }
  }
)

export const fetchGroup = createAsyncThunk(
  'group/fetchGroup',
  async ({ groupId }: { groupId: string }) => {
    try {
      if (!groupId) {
        throw new Error('Group ID is required')
      }
      const response = await getGroup(groupId)
      const groups = response?.data.group
      return groups
    } catch (error) {
      console.error('Failed to fetch fetchGroup:', error)
      throw error
    } finally {
    }
  }
)
export const refetchGroup = createAsyncThunk(
  'group/refetchGroup',
  async ({ groupId }: { groupId: string }) => {
    try {
      if (!groupId) {
        throw new Error('Group ID is required')
      }
      const response = await getGroup(groupId)
      const groups = response?.data.group
      return groups
    } catch (error) {
      console.error('Failed to fetch refetchGroup:', error)
      throw error
    } finally {
    }
  }
)
// Add these cases in extraReducers
const groupSlice = createSlice({
  name: 'group',
  initialState: InitialState,
  reducers: {
    setGroupList: (state, action) => {
      state.groupList = action.payload
      state.groupKeys = action.payload.reduce(
        (acc: any, group: UserGroupListType) => ({
          ...acc,
          [group.id]: group.id
        }),
        {}
      )
    },

    updateGroup: (state, action) => {
      const { groupId, group } = action.payload
      if (!groupId || !group) {
        console.error('Invalid payload: groupId and group are required')
        return
      }
      if (groupId === state?.group?.id) {
        state.group = { ...state.group, ...group }
      }
      if (state.groups[groupId]) {
        state.groups[groupId] = { ...state.groups[groupId], ...group }
      } else {
        console.error(`Group with id ${groupId} not found`)
      }
    },
    updateGroupMemberSettings: (state, action) => {
      const { groupId, settings } = action.payload

      console.log(
        '  state.group.memberSettings',
        '  state.group.memberSettings'
      )
      if (groupId === state?.group?.id) {
        if (state.group?.memberSettings) {
          state.group.memberSettings = {
            ...state.group.memberSettings,
            ...settings
          }
        } else if (state.group) {
          state.group = {
            ...state.group,
            memberSettings: {
              mute: settings?.mute || false,
              notifications: {
                option: settings?.notifications?.option || null,
                email: settings?.notifications?.email || true
              }
            }
          }
        }

        if (state.groups?.[groupId as string]?.memberSettings) {
          state.groups[groupId as string].memberSettings = {
            ...state.groups?.[groupId as string]?.memberSettings,
            ...settings
          }
        } else if (state.groups?.[groupId as string]) {
          state.groups[groupId as string] = {
            ...state.groups?.[groupId as string],
            memberSettings: {
              mute: settings?.mute || false,
              notifications: {
                option: settings?.notifications?.option || null,
                email: settings?.notifications?.email || true
              }
            }
          }
        }
      }
      if (state.groups[groupId]) {
        if (state.groups[groupId]?.memberSettings) {
          state.groups[groupId].memberSettings = {
            ...state.groups[groupId].memberSettings,
            ...settings
          }
        } else {
          state.groups[groupId] = {
            ...state.groups[groupId],
            memberSettings: {
              mute: settings?.mute || false,
              notifications: {
                option: settings.notifications.option,
                email: settings.notifications.email
              }
            }
          }
        }
      } else {
        console.error(`Group with id ${groupId} not found`)
      }
    },
    addGroupChannel: (state, action) => {
      const { groupId, channel } = action.payload
      const group = state.groups[groupId]
      if (!state.groups[groupId]) {
        state.groups[groupId] = {
          ...group,
          channels: [...group.channels, channel]
        }
      } else {
        state.groups[groupId] = {
          ...group,
          channels: [...group.channels, channel]
        }
      }
      if (state.group?.id === groupId && state?.group?.channels) {
        state.group.channels = [...state?.group?.channels, channel]
      }
    },
    updateGroupChannel: (state, action) => {
      const { groupId, channel } = action.payload
      const group = state.groups[groupId] || {}
      if (state.group?.id === groupId && state?.group?.channels) {
        state.group.channels = state?.group?.channels?.map(ch =>
          ch.id === channel.id ? { ...ch, ...channel } : ch
        )
      }
      state.groups[groupId] = {
        ...group,
        channels: group.channels.map(ch =>
          ch.id === channel.id ? { ...ch, ...channel } : ch
        )
      }
    },

    deleteGroupChannel: (state, action) => {
      const { groupId, channel } = action.payload
      const group = state.groups[groupId] || {}
      if (state.group?.id === groupId && state?.group?.channels) {
        state.group.channels = state?.group?.channels?.filter(
          ch => ch.id !== channel.id
        )
      }
      state.groups[groupId] = {
        ...group,
        channels: group.channels.filter(ch => ch.id !== channel.id)
      }
    },

    setGroup: (state, action) => {
      state.group = action.payload
    },

    updateGroupBfPermission: (state, action) => {
      const { groupId, fundId, permission } = action.payload
      if (state.group?.id === groupId && state.group?.bereavementFunds) {
        state.group = {
          ...state.group,
          bereavementFunds: state.group?.bereavementFunds?.map(fund =>
            fund.id === fundId
              ? {
                  ...fund,
                  roles: [...fund.roles, { permission: permission as BFRole }]
                }
              : fund
          )
        }
      }
      state.groups[groupId] = {
        ...state.groups[groupId],
        bereavementFunds: state.groups[groupId]?.bereavementFunds?.map(fund =>
          fund.id === fundId
            ? {
                ...fund,
                roles: [...fund.roles, { permission: permission as BFRole }]
              }
            : fund
        )
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGroupList.pending, state => {
        state.loading.fetchGroupList = true
      })
      .addCase(fetchGroupList.fulfilled, (state, action) => {
        state.loading.fetchGroupList = false
        // Use the same logic as setGroupList
        state.groupList = action.payload
        state.groupKeys = action.payload.reduce(
          (acc: any, group: UserGroupListType) => ({
            ...acc,
            [group.id]: group.id
          }),
          {}
        )
      })
      .addCase(fetchGroupList.rejected, state => {
        state.loading.fetchGroupList = false
      })
      .addCase(fetchGroup.pending, (state, action) => {
        state.groupLoadingData[action.meta.arg.groupId] = true
      })
      .addCase(fetchGroup.fulfilled, (state, action) => {
        const group = {
          ...action.payload,
          roles: action.payload.roles.map(role => role.permission)
        }
        state.groups[action.meta.arg.groupId] = {
          ...group,
          crowdfunding: (action.payload as any).crowdfunding || [],
          bereavementFunds: group.bereavementFunds.map(fund => ({
            ...fund,
            roles: fund.roles.map(role => ({
              permission: role.permission as 'ADMIN' | 'USER' | 'OWNER'
            }))
          }))
        }
        state.group = {
          ...group,
          crowdfunding: (action.payload as any).crowdfunding || [],
          bereavementFunds: group.bereavementFunds.map(fund => ({
            ...fund,
            roles: fund.roles.map(role => ({
              permission: role.permission as 'ADMIN' | 'USER' | 'OWNER'
            }))
          }))
        }
        state.groupLoadingData[action.meta.arg.groupId] = false
      })
      .addCase(fetchGroup.rejected, (state, action) => {
        state.groupLoadingData[action.meta.arg.groupId] = true
        state.loading.fetchGroup = false
      })
      .addCase(refetchGroup.pending, (state, action) => {
        state.groupLoadingData[action.meta.arg.groupId] = true
      })
      .addCase(refetchGroup.fulfilled, (state, action) => {
        const group = {
          ...action.payload,
          roles: action.payload.roles.map(role => role.permission)
        }
        state.groups[action.meta.arg.groupId] = {
          ...group,
          crowdfunding: (action.payload as any).crowdfunding || [],
          bereavementFunds: group.bereavementFunds.map(fund => ({
            ...fund,
            roles: fund.roles.map(role => ({
              permission: role.permission as 'ADMIN' | 'USER' | 'OWNER'
            }))
          }))
        }

        if (state.group?.id === action.meta.arg.groupId) {
          state.group = {
            ...group,
            crowdfunding: (action.payload as any).crowdfunding || [],
            bereavementFunds: group.bereavementFunds.map(fund => ({
              ...fund,
              roles: fund.roles.map(role => ({
                permission: role.permission as 'ADMIN' | 'USER' | 'OWNER'
              }))
            }))
          }
          state.groupLoadingData[action.meta.arg.groupId] = false
        }
      })
      .addCase(refetchGroup.rejected, (state, action) => {
        state.groupLoadingData[action.meta.arg.groupId] = true
        state.loading.refetchGroup = false
      })
  }
})

export const {
  setGroupList,
  setGroup,
  updateGroupMemberSettings,
  addGroupChannel,
  updateGroupBfPermission,
  updateGroupChannel,
  updateGroup,
  deleteGroupChannel
} = groupSlice.actions

export default groupSlice.reducer
