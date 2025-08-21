import { createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  isConnected: boolean
  groupOnlineUsers: {
    [groupId: string]: { [userId: string]: boolean }
  }
  onlineUsers: { [userId: string]: boolean }
}

const InitialState: InitialStateProps = {
  isConnected: false,
  groupOnlineUsers: {},
  onlineUsers: {}
}

const socketSlice = createSlice({
  name: 'socket',
  initialState: InitialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload
    },
    setGroupOnlineUsers: (state, action) => {
      state.groupOnlineUsers = action.payload
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },

    updateGroupUserOnlineStatus: (
      state,
      action: {
        payload: { groupId: string; userId: string; isOnline: boolean }
      }
    ) => {
      const { userId, isOnline } = action.payload
      state.onlineUsers[userId] = isOnline
    },

    updateUserOnlineStatus: (
      state,
      action: {
        payload: {  userId: string; isOnline: boolean }
      }
    ) => {
      const { userId, isOnline } = action.payload
      state.onlineUsers[userId] = isOnline
    }
  }
})

export const {
  setConnected,
  setGroupOnlineUsers,
  updateGroupUserOnlineStatus,
  setOnlineUsers,
  updateUserOnlineStatus
} = socketSlice.actions

export default socketSlice.reducer
