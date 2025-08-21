import {
  getUnreadChannelMessageCounts,
  getUnreadGroupMessageCounts
} from '@/api/group' // Remove getGroupRoles
import {
  getChannelMessages,
  MessagesPagination,
  MessageType
} from '@/api/messaging/group'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  loading: { [key: string]: boolean }
  unreadGroupMessageCounts: Record<string, number> | undefined
  unreadChannelMessageCounts: Record<string, boolean> | undefined
  groupLoading: {
    [groupId: string]: {
      [channelId: string]: {
        messages: boolean
        data: boolean
      }
    }
  }
  groupMoreLoading: {
    [groupId: string]: {
      [channelId: string]: {
        messages: boolean
        data: boolean
      }
    }
  }
  channelMessages: {
    [groupId: string]: {
      [channelId: string]: {
        pagination: MessagesPagination
        messages: MessageType[]
      }
    }
  }
  channelMoreMessages: {
    [groupId: string]: {
      [channelId: string]: {
        pagination: MessagesPagination
        messages: MessageType[]
      }
    }
  }
  groupLoadingData: {
    [groupId: string]: boolean
  }
}
// First, add loading state to InitialState
const InitialState: InitialStateProps = {
  unreadGroupMessageCounts: {},
  unreadChannelMessageCounts: {},
  loading: {
    fetchUnreadGroupMessageCounts: false,
    fetchUnreadChannelMessageCounts: false
  },
  channelMoreMessages: {},
  groupLoading: {},
  groupMoreLoading: {},
  groupLoadingData: {},
  channelMessages: {}
}

export const fetchUnreadGroupMessageCounts = createAsyncThunk(
  'group/fetchUnreadGroupMessageCounts',
  async () => {
    try {
      const response = await getUnreadGroupMessageCounts()
      const readMessages = response?.data.counts
      return readMessages
    } catch (error) {
      console.error('Failed to fetch user:', error)
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

export const fetchGroupMessages = createAsyncThunk(
  'group/fetchGroupMessages', // Keep this as is
  async ({ groupId, channelId }: { groupId: string; channelId: string }) => {
    try {
      const response = await getChannelMessages(groupId, channelId, {
        pageSize: 20
      })
      const messages = response?.data.messages
      const pagination = response?.data.pagination
      return {
        pagination,
        messages
      } as {
        pagination: MessagesPagination
        messages: MessageType[]
      }
    } catch (error) {
      console.error('Failed to fetch fetchGroupMessages:', error)
      throw error
    } finally {
    }
  }
)

export const fetchGroupMoreMessages = createAsyncThunk(
  'group/fetchGroupMoreMessages', // Changed to unique action type
  async ({
    groupId,
    channelId,
    params
  }: {
    groupId: string
    channelId: string
    params: { [key: string]: any }
  }) => {
    try {
      const response = await getChannelMessages(groupId, channelId, params)
      const messages = response?.data.messages
      const pagination = response?.data.pagination
      return {
        pagination,
        messages
      } as {
        pagination: MessagesPagination
        messages: MessageType[]
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    } finally {
    }
  }
)

// Add these cases in extraReducers
const groupMessageSlice = createSlice({
  name: 'groupMessage',
  initialState: InitialState,
  reducers: {
    setChannelMessages: (state, action) => {
      const { groupId, channelId, messages, pagination } = action.payload
      if (!state.channelMessages[groupId]) {
        state.channelMessages[groupId] = {}
      }
      state.channelMessages[groupId][channelId] = { messages, pagination }
    },

    clearChannelMessages: (state, action) => {
      const { groupId, channelId } = action.payload
      if (state.channelMessages[groupId]?.[channelId]) {
        delete state.channelMessages[groupId][channelId]
      }
    },

    removeChannelMessage: (state, action) => {
      const { groupId, channelId, messageId } = action.payload
      if (state.channelMessages?.[groupId]?.[channelId]) {
        state.channelMessages[groupId][channelId].messages =
          state.channelMessages[groupId][channelId].messages.filter(
            m => m.id !== messageId
          )
      }
    },

    handleEditMessage: (state, action) => {
      const { groupId, channelId, messageId, text } = action.payload
      const message = state.channelMessages[groupId]?.[
        channelId
      ]?.messages.find(m => m.id === messageId)
      if (message) {
        message.text = text
        message.edited = true
      }
    },
    addMessageReaction: (state, action) => {
      const {
        messageId,
        userId,
        emoji,
        groupId,
        channelId,
        reactionId,
        createdAt
      } = action.payload
      const message = state.channelMessages[groupId]?.[
        channelId
      ]?.messages.find(m => m.id === messageId)
      if (message) {
        message.messageReaction = message.messageReaction
          ? [
            ...message.messageReaction,
            {
              id: reactionId,
              messageId,
              userId,
              emoji,
              createdAt
            }
          ]
          : [
            {
              id: reactionId,
              messageId,
              userId,
              emoji,
              createdAt
            }
          ]
      }
    },

    removeMessageReaction: (state, action) => {
      const { messageId, groupId, channelId, reactionId } = action.payload
      const message = state.channelMessages[groupId]?.[
        channelId
      ]?.messages.find(m => m.id === messageId)
      if (message) {
        message.messageReaction = message.messageReaction?.filter(
          r => r.id !== reactionId
        )
      }
    },
    addNewMessages: (state, action) => {
      const { groupId, channelId, message } = action.payload
      if (!state.channelMessages[groupId]) {
        state.channelMessages[groupId] = {}
      }
      if (!state.channelMessages[groupId][channelId]) {
        state.channelMessages[groupId][channelId] = {
          messages: [],
          pagination: {
            totalMembers: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 0,
            page: 0,
            totalCount: 0,
            hasMorePage: false,
            hasPreviousPage: false,
            hasNextPage: false
          }
        }
      }
      state.channelMessages[groupId][channelId].messages = [
        ...state.channelMessages[groupId][channelId].messages,
        message
      ]
    },

    updateChannelMessage: (state, action) => {
      const { groupId, channelId, messageId, updatedFields } = action.payload
      const messages = state.channelMessages[groupId]?.[channelId]?.messages
      if (messages) {
        const index = messages.findIndex(m => m.id === messageId)
        if (index !== -1) {
          messages[index] = {
            ...messages[index],
            ...updatedFields
          }
        }
      }
    },

    addMoreMessages: (state, action) => {
      const { groupId, channelId, messages, pagination } = action.payload
      if (!state.channelMessages[groupId]) {
        state.channelMessages[groupId] = {}
      }
      if (!state.channelMessages[groupId][channelId]) {
        state.channelMessages[groupId][channelId] = {
          messages: messages,
          pagination
        }
      }
      state.channelMessages[groupId][channelId].messages = [
        ...messages,
        ...state.channelMessages[groupId][channelId].messages
      ]
      state.channelMessages[groupId][channelId].pagination = pagination
    },

    setGroupMoreMessagesLoading: (state, action) => {
      const { groupId, channelId, type, value } = action.payload
      if (!state.groupMoreLoading[groupId]) {
        state.groupMoreLoading[groupId] = {}
      }
      if (!state.groupMoreLoading[groupId][channelId]) {
        state.groupMoreLoading[groupId][channelId] = {
          messages: false,
          data: false
        }
      }
      state.groupMoreLoading[groupId][channelId][
        type as keyof typeof state.groupMoreLoading[typeof groupId][typeof channelId]
      ] = value
    },
    setGroupMessagesLoading: (state, action) => {
      const { groupId, channelId, type, value } = action.payload
      if (!state.groupLoading[groupId]) {
        state.groupLoading[groupId] = {}
      }
      if (!state.groupLoading[groupId][channelId]) {
        state.groupLoading[groupId][channelId] = {
          messages: false,
          data: false
        }
      }
      state.groupLoading[groupId][channelId][
        type as keyof typeof state.groupLoading[typeof groupId][typeof channelId]
      ] = value
    },
    updateUnreadGroupMessageCounts: (state, action) => {
      const { groupId, count } = action.payload
      if (!state.unreadGroupMessageCounts) {
        state.unreadGroupMessageCounts = {}
      }

      state.unreadGroupMessageCounts[groupId] = count
    },
    addUnreadGroupMessageCounts: (state, action) => {
      const { groupId, count } = action.payload
      if (!state.unreadGroupMessageCounts) {
        state.unreadGroupMessageCounts = {}
      }

      state.unreadGroupMessageCounts[groupId] =
        state.unreadGroupMessageCounts[groupId] + count
    },

    updateUnreadChannelMessageCounts: (state, action) => {
      const { channelId, value } = action.payload
      if (!state.unreadChannelMessageCounts) {
        state.unreadChannelMessageCounts = {}
      }
      state.unreadChannelMessageCounts[channelId] = value
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGroupMessages.pending, (state, action) => {
        const { groupId, channelId } = action.meta.arg
        groupMessageSlice.caseReducers.setGroupMessagesLoading(state, {
          payload: { groupId, channelId, type: 'messages', value: true },
          type: 'setGroupMessagesLoading'
        })
      })
      .addCase(fetchGroupMessages.fulfilled, (state, action) => {
        const { groupId, channelId } = action.meta.arg
        // Update loading state
        groupMessageSlice.caseReducers.setGroupMessagesLoading(state, {
          payload: { groupId, channelId, type: 'messages', value: false },
          type: 'setGroupMessagesLoading'
        })
        // Store messages
        groupMessageSlice.caseReducers.setChannelMessages(state, {
          payload: {
            groupId,
            channelId,
            messages: action.payload.messages,
            pagination: action.payload.pagination
          },
          type: 'setChannelMessages'
        })
      })
      .addCase(fetchGroupMessages.rejected, (state, action) => {
        const { groupId, channelId } = action.meta.arg
        groupMessageSlice.caseReducers.setGroupMessagesLoading(state, {
          payload: { groupId, channelId, type: 'messages', value: false },
          type: 'setGroupMessagesLoading'
        })
      })
      .addCase(fetchGroupMoreMessages.pending, (state, action) => {
        const { groupId, channelId } = action.meta.arg
        groupMessageSlice.caseReducers.setGroupMoreMessagesLoading(state, {
          payload: { groupId, channelId, type: 'messages', value: true },
          type: 'setGroupMoreMessagesLoading'
        })
      })
      .addCase(fetchGroupMoreMessages.fulfilled, (state, action) => {
        const { groupId, channelId } = action.meta.arg
        // Update loading state
        groupMessageSlice.caseReducers.setGroupMoreMessagesLoading(state, {
          payload: { groupId, channelId, type: 'messages', value: false },
          type: 'setGroupMoreMessagesLoading'
        })
      })
      .addCase(fetchGroupMoreMessages.rejected, (state, action) => {
        const { groupId, channelId } = action.meta.arg
        groupMessageSlice.caseReducers.setGroupMoreMessagesLoading(state, {
          payload: { groupId, channelId, type: 'messages', value: false },
          type: 'setGroupMoreMessagesLoading'
        })
      })
      .addCase(fetchUnreadGroupMessageCounts.pending, state => {
        state.loading.fetchUnreadGroupMessageCounts = true
      })
      .addCase(fetchUnreadGroupMessageCounts.fulfilled, (state, action) => {
        state.loading.fetchUnreadGroupMessageCounts = false
        // Handle the readMessages data here if needed
        state.unreadGroupMessageCounts = action.payload
      })
      .addCase(fetchUnreadGroupMessageCounts.rejected, state => {
        state.loading.fetchUnreadGroupMessageCounts = false
      })
      .addCase(fetchUnreadChannelMessageCounts.pending, state => {
        state.loading.fetchUnreadChannelMessageCounts = true
      })
      .addCase(fetchUnreadChannelMessageCounts.fulfilled, (state, action) => {
        state.loading.fetchUnreadChannelMessageCounts = false
        // Handle the readMessages data here if needed
        state.unreadChannelMessageCounts = action.payload
      })
      .addCase(fetchUnreadChannelMessageCounts.rejected, state => {
        state.loading.fetchUnreadChannelMessageCounts = false
      })
  }
})

export const {
  addMessageReaction,
  removeMessageReaction,
  setChannelMessages,
  clearChannelMessages,
  addNewMessages,
  addMoreMessages,
  updateUnreadGroupMessageCounts,
  updateUnreadChannelMessageCounts,
  addUnreadGroupMessageCounts,
  removeChannelMessage,
  updateChannelMessage,
  handleEditMessage

} = groupMessageSlice.actions

export default groupMessageSlice.reducer
