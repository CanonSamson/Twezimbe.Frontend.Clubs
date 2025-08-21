import { MessageType } from '@/api/messaging/group'
import { createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  messages: { [groupId: string]: { [channelId: string]: MessageType } }
}
// First, add loading state to InitialState
const InitialState: InitialStateProps = {
  messages: {}
}

// Add these cases in extraReducers
const groupMessageInEditSlice = createSlice({
  name: 'groupMessageInEdit',
  initialState: InitialState,
  reducers: {
    setMesageInEdit: (state, action) => {
      const { groupId, channelId, message } = action.payload

      // Initialize group if it doesn't exist
      if (!state.messages[groupId]) {
        state.messages[groupId] = {}
      }

      // Set the message for the specific channel
      state.messages[groupId][channelId] = message
    },
    removeMesageInEdit: (state, action) => {
      const { groupId, channelId } = action.payload
      // Remove the message for the specific channel
      delete state.messages?.[groupId]?.[channelId]
    }
  }
})

export const { setMesageInEdit, removeMesageInEdit } =
  groupMessageInEditSlice.actions

export default groupMessageInEditSlice.reducer
