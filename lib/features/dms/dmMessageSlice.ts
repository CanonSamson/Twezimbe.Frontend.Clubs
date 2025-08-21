import { DmMessageType } from '@/api/dms/messaging'
import {
  getConversationMessages,
  getUnreadCount,
  DMMessageParams
} from '@/api/messaging/dm'
import { MessagesPagination } from '@/api/messaging/group'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  loading: { [key: string]: boolean }
  dmLoading: {
    [conversationId: string]: {
      messages: boolean
      data: boolean
    }
  }
  dmMoreLoading: {
    [conversationId: string]: {
      messages: boolean
      data: boolean
    }
  }
  messages: {
    [conversationId: string]: {
      pagination: MessagesPagination
      messages: DmMessageType[]
    }
  }
  unreadCount: number
  dmLoadingData: {
    [conversationId: string]: boolean
  }
}
const InitialState: InitialStateProps = {
  loading: {
    fetchUnreadCount: false,
    fetchDmMessages: false,
    fetchDmMoreMessages: false
  },
  dmLoading: {},
  dmMoreLoading: {},
  dmLoadingData: {},
  messages: {},
  unreadCount: 0
}

export const fetchUnreadCount = createAsyncThunk(
  'dm/fetchUnreadCount',
  async () => {
    try {
      const response = await getUnreadCount()
      const unreadCount = response?.data.data?.count || 0
      return unreadCount
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
      throw error
    }
  }
)

export const fetchDmMessages = createAsyncThunk(
  'dm/fetchDmMessages',
  async ({
    otherUserId,
    params
  }: {
    otherUserId: string
    params?: DMMessageParams
  }) => {
    try {
      const response = await getConversationMessages(otherUserId, {
        limit: 20,
        ...params
      })
      const messages = response?.data?.messages || []
      const pagination = response?.data?.pagination
      return {
        otherUserId,
        pagination,
        messages
      } as {
        otherUserId: string
        pagination: MessagesPagination
        messages: DmMessageType[]
      }
    } catch (error) {
      console.error('Failed to fetch DM messages:', error)
      throw error
    }
  }
)

export const fetchDmMoreMessages = createAsyncThunk(
  'dm/fetchDmMoreMessages',
  async ({
    conversationId,
    params
  }: {
    conversationId: string
    params: DMMessageParams
  }) => {
    try {
      const response = await getConversationMessages(conversationId, params)
      const messages = response?.data?.messages || []
      const pagination = response?.data?.pagination
      return {
        conversationId,
        pagination,
        messages
      } as {
        conversationId: string
        pagination: MessagesPagination
        messages: DmMessageType[]
      }
    } catch (error) {
      console.error('Failed to fetch more DM messages:', error)
      throw error
    }
  }
)

const dmMessageSlice = createSlice({
  name: 'dmMessage',
  initialState: InitialState,
  reducers: {
    setConversationMessages: (state, action) => {
      const { otherUserId, messages, pagination } = action.payload
      state.messages[otherUserId] = { messages, pagination }
    },
    addMessage: (state, action) => {
      const { otherUserId, message } = action.payload
      if (state.messages[otherUserId]) {
        state.messages[otherUserId].messages.push(message)
      }
    },

    addNewDmMessage: (state, action) => {
      const { otherUserId, message } = action.payload

      if (!state.messages[otherUserId]) {
        state.messages[otherUserId] = {
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
      state.messages[otherUserId].messages = [
        ...state.messages[otherUserId].messages,
        message
      ]
    },
    updateMessage: (state, action) => {
      const { otherUserId, messageId, updates } = action.payload
      if (state.messages[otherUserId]) {
        const messageIndex = state.messages[otherUserId].messages.findIndex(
          msg => msg.id === messageId
        )
        if (messageIndex !== -1) {
          state.messages[otherUserId].messages[messageIndex] = {
            ...state.messages[otherUserId].messages[messageIndex],
            ...updates
          }
        }
      }
    },
    removeMessage: (state, action) => {
      const { otherUserId, messageId } = action.payload
      if (state.messages[otherUserId]) {
        state.messages[otherUserId].messages = state.messages[
          otherUserId
        ].messages.filter(msg => msg.id !== messageId)
      }
    },
    handleEditDmMessage: (state, action) => {
      const { otherUserId, messageId, text } = action.payload
      const message = state.messages[otherUserId]?.messages.find(
        m => m.id === messageId
      )
      if (message) {
        message.text = text
        message.edited = true
      }
    },
    removeDmMessage: (state, action) => {
      const { otherUserId, messageId } = action.payload
      if (state.messages?.[otherUserId]) {
        state.messages[otherUserId].messages = state.messages[
          otherUserId
        ].messages.filter(m => m.id !== messageId)
      }
    }
  },
  extraReducers: builder => {
    builder
      // Fetch unread count
      .addCase(fetchUnreadCount.pending, state => {
        state.loading.fetchUnreadCount = true
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading.fetchUnreadCount = false
        state.unreadCount = action.payload
      })
      .addCase(fetchUnreadCount.rejected, state => {
        state.loading.fetchUnreadCount = false
      })
      // Fetch DM messages
      .addCase(fetchDmMessages.pending, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId
        state.dmLoading[otherUserId] = {
          messages: true,
          data: false
        }
      })
      .addCase(fetchDmMessages.fulfilled, (state, action) => {
        const { otherUserId, messages, pagination } = action.payload
        state.dmLoading[otherUserId] = {
          messages: false,
          data: false
        }
        state.messages[otherUserId] = { messages, pagination }
      })
      .addCase(fetchDmMessages.rejected, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId
        state.dmLoading[otherUserId] = {
          messages: false,
          data: false
        }
      })
      // Fetch more DM messages
      .addCase(fetchDmMoreMessages.pending, (state, action) => {
        const conversationId = action.meta.arg.conversationId
        state.dmMoreLoading[conversationId] = {
          messages: true,
          data: false
        }
      })
      .addCase(fetchDmMoreMessages.fulfilled, (state, action) => {
        const { conversationId, messages, pagination } = action.payload
        state.dmMoreLoading[conversationId] = {
          messages: false,
          data: false
        }
        if (state.messages[conversationId]) {
          state.messages[conversationId].messages = [
            ...messages,
            ...state.messages[conversationId].messages
          ]
          state.messages[conversationId].pagination = pagination
        } else {
          state.messages[conversationId] = { messages, pagination }
        }
      })
      .addCase(fetchDmMoreMessages.rejected, (state, action) => {
        const conversationId = action.meta.arg.conversationId
        state.dmMoreLoading[conversationId] = {
          messages: false,
          data: false
        }
      })
  }
})

export const {
  setConversationMessages,
  addMessage,
  updateMessage,
  removeMessage,
  addNewDmMessage,
  handleEditDmMessage,
  removeDmMessage
} = dmMessageSlice.actions

export default dmMessageSlice.reducer
