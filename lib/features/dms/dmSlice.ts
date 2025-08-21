import { getDm, getGroupDmsList, getUserDmsList } from '@/api/dms'
import {
  DmConversation,
  DmDetailsType,
  DmPagination,
  GroupDmConversation
} from '@/types/dms'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  dms: { [otherUserId: string]: DmDetailsType }
  conversations: DmConversation[]
  groupConversations: { [groupId: string]: GroupDmConversation[] }
  pagination: DmPagination | null
  dmKeys: { [key: string]: string }
  loading: {
    fetchDmsList: boolean
    fetchGroupDmsList: { [groupId: string]: boolean }
    fetchDm: { [otherUserId: string]: boolean }
  }
}

// First, add loading state to InitialState
const InitialState: InitialStateProps = {
  dms: {},
  conversations: [],
  groupConversations: {},
  pagination: null,
  dmKeys: {},
  loading: {
    fetchDmsList: false,
    fetchGroupDmsList: {},
    fetchDm: {}
  }
}

export const fetchDmsList = createAsyncThunk('dm/fetchDmsList', async () => {
  try {
    const response = await getUserDmsList()
    return {
      conversations: response.data?.conversations,
      pagination: response.data?.pagination
    }
  } catch (error) {
    console.error('Failed to fetch fetchDmsList:', error)
    throw error
  }
})

export const fetchGroupDmsList = createAsyncThunk(
  'dm/fetchGroupDmsList',
  async (groupId: string) => {
    try {
      const response = await getGroupDmsList(groupId)
      return {
        groupId,
        conversations: response.data.conversations,
        totalMembers: response.data.totalMembers,
        conversationsFound: response.data.conversationsFound
      }
    } catch (error) {
      console.error('Failed to fetch fetchGroupDmsList:', error)
      throw error
    }
  }
)

export const fetchDm = createAsyncThunk(
  'dm/fetchDm',
  async ({ otherUserId }: { otherUserId: string }) => {
    try {
      if (!otherUserId) {
        throw new Error('dm ID is required')
      }
      const response = await getDm(otherUserId)
      return response?.data.conversation
    } catch (error) {
      console.error('Failed to fetch fetchDm:', error)
      throw error
    }
  }
)

export const refetchDm = createAsyncThunk(
  'dm/refetchDm',
  async ({ otherUserId }: { otherUserId: string }) => {
    try {
      if (!otherUserId) {
        throw new Error('dm ID is required')
      }
      const response = await getDm(otherUserId)
      return response?.data.conversation
    } catch (error) {
      console.error('Failed to fetch refetchDm:', error)
      throw error
    }
  }
)

// Add these cases in extraReducers
const dmSlice = createSlice({
  name: 'dm',
  initialState: InitialState,
  reducers: {
    setDmsList: (state, action) => {
      const { conversations, pagination } = action.payload
      state.conversations = conversations
      state.pagination = pagination
      state.dmKeys = conversations.reduce(
        (acc: Record<string, string>, conversation: DmConversation) => ({
          ...acc,
          [conversation.id]: conversation.id
        }),
        {}
      )
    },
    updateDm: (state, action) => {
      const { dm } = action.payload
      if (!state.dms[dm.id]) {
        state.dms[dm.id] = dm
      }

      state.dms[dm.id] = {
        ...state.dms[dm.id],
        ...dm
      }
    },
    addNewDm: (state, action) => {
      const { dm } = action.payload
      state.dms[dm.id] = dm
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDmsList.pending, state => {
        state.loading.fetchDmsList = true
      })
      .addCase(fetchDmsList.fulfilled, (state, action) => {
        state.loading.fetchDmsList = false
        const { conversations, pagination } = action.payload
        state.conversations = conversations
        state.pagination = pagination
        state.dmKeys = conversations.reduce(
          (acc: any, conversation: DmConversation) => ({
            ...acc,
            [conversation.id]: conversation.id
          }),
          {}
        )
      })
      .addCase(fetchDmsList.rejected, state => {
        state.loading.fetchDmsList = false
      })
      .addCase(fetchGroupDmsList.pending, (state, action) => {
        const groupId = action.meta.arg
        state.loading.fetchGroupDmsList[groupId] = true
      })
      .addCase(fetchGroupDmsList.fulfilled, (state, action) => {
        const { groupId, conversations } = action.payload
        state.loading.fetchGroupDmsList[groupId] = false
        state.groupConversations[groupId] = conversations
      })
      .addCase(fetchGroupDmsList.rejected, (state, action) => {
        const groupId = action.meta.arg
        state.loading.fetchGroupDmsList[groupId] = false
      })
      .addCase(fetchDm.pending, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId
        state.loading.fetchDm[otherUserId] = true
      })
      .addCase(fetchDm.fulfilled, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId
        state.loading.fetchDm[otherUserId] = false
        const dmData = action.payload
        state.dms[otherUserId] = dmData
      })
      .addCase(fetchDm.rejected, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId
        state.loading.fetchDm[otherUserId] = false
      })
      .addCase(refetchDm.pending, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId
        state.loading.fetchDm[otherUserId] = true
      })
      .addCase(refetchDm.fulfilled, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId
        state.loading.fetchDm[otherUserId] = false
        const dmData = action.payload
        state.dms[otherUserId] = dmData
      })
      .addCase(refetchDm.rejected, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId
        state.loading.fetchDm[otherUserId] = false
      })
  }
})

export const { setDmsList, updateDm, addNewDm } = dmSlice.actions

export default dmSlice.reducer
