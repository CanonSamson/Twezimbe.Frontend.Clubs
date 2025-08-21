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
const groupMessageInReplySlice = createSlice({
  name: 'groupMessageInReply',
  initialState: InitialState,
  reducers: {
    setMesageInReply: (state, action) => {
      const { groupId, channelId, message } = action.payload

      // Initialize group if it doesn't exist
      if (!state.messages[groupId]) {
        state.messages[groupId] = {}
      }

      // Set the message for the specific channel
      state.messages[groupId][channelId] = message
    },
    removeMesageInReply: (state, action) => {
      const { groupId, channelId } = action.payload
      // Remove the message for the specific channel
      delete state.messages?.[groupId]?.[channelId]
    }
  }
})

export const { setMesageInReply, removeMesageInReply } = groupMessageInReplySlice.actions

export default groupMessageInReplySlice.reducer
