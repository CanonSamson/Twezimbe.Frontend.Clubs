import { getReceiverInvite, getReceiverInviteCount } from '@/api/invite'
import {
  GeneralNotificationType,
  getGeneralNotifications,
  getGeneralUnreadNotificationsCount,
  PaginationType
} from '@/api/notification'
import { getReceiverRequest, getReceiverRequestCount } from '@/api/request'
import { InviteType } from '@/types/invite'
import { RequestType } from '@/types/request'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


interface InitialStateProps {
  loading: { [key: string]: boolean }
  unreadCount: { counts: { [key: string]: number }, total: number }
  notifications: GeneralNotificationType[]
  bfNotifications: GeneralNotificationType[] // Added BF notifications
  mentionNotifications: GeneralNotificationType[]
  requests: RequestType[]
  invites: InviteType[]
  pendingInvitesCount: number
  pendingRequestsCount: number
  notificationPagination: PaginationType
  bfNotificationPagination: PaginationType // Added BF notification pagination
  mentionNotificationPagination: PaginationType
}

const InitialState: InitialStateProps = {
  loading: {
    fetchGeneralUnreadNotificationsCount: false,
    fetchGeneralNotifications: false,
    fetchBfGeneralNotifications: false, // Added BF notifications loading state
    fetchMentionNotifications: false,
    fetchReceiverRequest: false,
    fetchReceiverInvite: false,
    fetchReceiverRequestCount: false,
    fetchReceiverInviteCount: false
  },
  unreadCount: {
    counts: {},
    total: 0
  },
  notifications: [],
  bfNotifications: [], // Initialize BF notifications
  notificationPagination: undefined,
  bfNotificationPagination: undefined, // Initialize BF notification pagination
  mentionNotificationPagination: undefined,
  mentionNotifications: [],
  requests: [],
  pendingInvitesCount: 0,
  pendingRequestsCount: 0,
  invites: []
}


export const fetchGeneralUnreadNotificationsCount = createAsyncThunk(
  'notification/fetchGeneralUnreadNotificationsCount',
  async () => {
    try {
      const response = await getGeneralUnreadNotificationsCount()
      return response?.data
    } catch (error) {
      console.error('Failed to fetch notifications count:', error)
      throw error
    }
  }
)

export const fetchBfGeneralNotifications = createAsyncThunk(
  'notification/fetchBfGeneralNotifications',
  async ({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
    try {
      const response = await getGeneralNotifications({
        limit,
        offset,
        isBf: true
      })
      return { data: response?.data }
    } catch (error) {
      console.error('Failed to fetch BF notifications:', error)
      throw error
    }
  }
)

export const fetchGeneralNotifications = createAsyncThunk(
  'notification/fetchGeneralNotifications',
  async ({ limit = 20, offset = 0, isBf }: { limit?: number; offset?: number, isBf?: boolean }) => {
    try {
      const response = await getGeneralNotifications({
        limit,
        offset,
        isBf
      })
      return { data: response?.data }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      throw error
    }
  }
)

export const fetchMentionNotifications = createAsyncThunk(
  'notification/fetchMentionNotifications',
  async ({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
    try {
      const response = await getGeneralNotifications({
        limit,
        offset,
        type: 'mention'
      })
      return { data: response?.data }
    } catch (error) {
      console.error('Failed to fetch mention notifications:', error)
      throw error
    }
  }
)

export const fetchReceiverRequest = createAsyncThunk(
  'notification/fetchReceiverRequest',
  async ({ limit = 20, offset = 0, status }: { limit?: number; offset?: number, status?: string }) => {
    try {
      const response = await getReceiverRequest({
        status,
        limit,
        offset
      })
      return { data: response?.data }
    } catch (error) {
      console.error('Failed to fetch receiver requests:', error)
      throw error
    }
  }
)

export const fetchReceiverRequestCount = createAsyncThunk(
  'notification/fetchReceiverRequestCount',
  async ({ status }: { status?: string }) => {
    try {
      const response = await getReceiverRequestCount({
        status
      })
      return { count: response?.data?.count }
    } catch (error) {
      console.error('Failed to fetch receiver request count:', error)
      throw error
    }
  }
)

export const fetchReceiverInvite = createAsyncThunk(
  'notification/fetchReceiverInvite',
  async ({ limit = 20, offset = 0, status }: { limit?: number; offset?: number, status?: string }) => {
    try {
      const response = await getReceiverInvite({
        status,
        limit,
        offset
      })
      return { data: response?.data }
    } catch (error) {
      console.error('Failed to fetch receiver invites:', error)
      throw error
    }
  }
)

export const fetchReceiverInviteCount = createAsyncThunk(
  'notification/fetchReceiverInviteCount',
  async ({ status }: { status?: string }) => {
    try {
      const response = await getReceiverInviteCount({
        status
      })
      return { count: response?.data?.count }
    } catch (error) {
      console.error('Failed to fetch receiver invite count:', error)
      throw error
    }
  }
)

const generalNotificationSlice = createSlice({
  name: 'generalNotifications',
  initialState: InitialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload
    },
    setBfNotifications: (state, action) => { // Added BF notifications setter
      state.bfNotifications = action.payload
    },
    addMoreNotifications: (state, action) => {
      state.notifications = [...state.notifications, ...action.payload]
    },
    addMoreBfNotifications: (state, action) => { // Added BF notifications adder
      state.bfNotifications = [...state.bfNotifications, ...action.payload]
    },
    addRequests: (state, action) => {
      state.requests = [...action.payload, ...state?.requests]
    },
    incrementPendingRequestsCount: (state, action) => {
      state.pendingRequestsCount = action.payload?.count
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGeneralUnreadNotificationsCount.pending, state => {
        state.loading.fetchGeneralUnreadNotificationsCount = true
      })
      .addCase(
        fetchGeneralUnreadNotificationsCount.fulfilled,
        (state, action) => {
          state.loading.fetchGeneralUnreadNotificationsCount = false
          state.unreadCount = action.payload
        }
      )
      .addCase(fetchGeneralUnreadNotificationsCount.rejected, state => {
        state.loading.fetchGeneralUnreadNotificationsCount = false
      })

      // BF Notifications reducers - ADDED
      .addCase(fetchBfGeneralNotifications.pending, state => {
        state.loading.fetchBfGeneralNotifications = true
      })
      .addCase(fetchBfGeneralNotifications.fulfilled, (state, action) => {
        state.loading.fetchBfGeneralNotifications = false
        if (state.bfNotifications?.length > 0) {
          state.bfNotifications = [...state.bfNotifications, ...action.payload?.data?.data]
        } else {
          state.bfNotifications = action.payload?.data?.data
        }
        state.bfNotificationPagination = action.payload?.data.pagination
      })
      .addCase(fetchBfGeneralNotifications.rejected, state => {
        state.loading.fetchBfGeneralNotifications = false
      })

      .addCase(fetchReceiverRequestCount.pending, state => {
        state.loading.fetchReceiverRequestCount = true
      })
      .addCase(
        fetchReceiverRequestCount.fulfilled,
        (state, action) => {
          state.loading.fetchReceiverRequestCount = false
          state.pendingRequestsCount = action.payload?.count
        }
      ).addCase(fetchReceiverRequestCount.rejected, state => {
        state.loading.fetchReceiverRequestCount = false
      })
      .addCase(fetchReceiverInviteCount.pending, state => {
        state.loading.fetchReceiverInviteCount = true
      })
      .addCase(
        fetchReceiverInviteCount.fulfilled,
        (state, action) => {
          state.loading.fetchReceiverInviteCount = false
          state.pendingInvitesCount = action.payload?.count
        }
      ).addCase(fetchReceiverInviteCount.rejected, state => {
        state.loading.fetchReceiverInviteCount = false
      })
      .addCase(fetchGeneralNotifications.pending, state => {
        state.loading.fetchGeneralNotifications = true
      })
      .addCase(fetchGeneralNotifications.fulfilled, (state, action) => {
        state.loading.fetchGeneralNotifications = false
        if (state.notifications?.length > 0) {
          state.notifications = [...state.notifications, ...action.payload?.data?.data]
        } else {
          state.notifications = action.payload?.data?.data
        }
        state.notificationPagination = action.payload?.data.pagination
      })
      .addCase(fetchGeneralNotifications.rejected, state => {
        state.loading.fetchGeneralNotifications = false
      })
      .addCase(fetchMentionNotifications.pending, state => {
        state.loading.fetchMentionNotifications = true
      })
      .addCase(fetchMentionNotifications.fulfilled, (state, action) => {
        state.loading.fetchMentionNotifications = false
        if (state.mentionNotifications?.length > 0) {
          state.mentionNotifications = [...state.mentionNotifications, ...action.payload?.data?.data]
        } else {
          state.mentionNotifications = action.payload?.data?.data
        }
        state.mentionNotificationPagination = action.payload?.data.pagination
      })
      .addCase(fetchMentionNotifications.rejected, state => {
        state.loading.fetchMentionNotifications = false
      })
      .addCase(fetchReceiverRequest.pending, state => {
        state.loading.fetchReceiverRequest = true
      })
      .addCase(fetchReceiverRequest.fulfilled, (state, action) => {
        state.loading.fetchReceiverRequest = false
        state.requests = action.payload?.data?.requests
      })
      .addCase(fetchReceiverRequest.rejected, state => {
        state.loading.fetchReceiverRequest = false
      })
      .addCase(fetchReceiverInvite.pending, state => {
        state.loading.fetchReceiverInvite = true
      })
      .addCase(fetchReceiverInvite.fulfilled, (state, action) => {
        state.loading.fetchReceiverInvite = false
        state.invites = action.payload?.data?.invites
      })
      .addCase(fetchReceiverInvite.rejected, state => {
        state.loading.fetchReceiverInvite = false
      })
  }
})

export const {
  setUnreadCount,
  setNotifications,
  setBfNotifications, // Export new BF notifications setter
  addMoreNotifications,
  addMoreBfNotifications, // Export new BF notifications adder
  addRequests,
  incrementPendingRequestsCount
} = generalNotificationSlice.actions

export default generalNotificationSlice.reducer