import { DmMessageType } from '@/api/dms/messaging'
import { createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  messages: { [otherUserId: string]: DmMessageType | undefined }
}
// First, add loading state to InitialState
const InitialState: InitialStateProps = {
  messages: {}
}

// Add these cases in extraReducers
const dmMessageInReplySlice = createSlice({
  name: 'dmMessageInReply',
  initialState: InitialState,
  reducers: {
    setMesageInReply: (state, action) => {
      const { otherUserId, message } = action.payload as { otherUserId: string; message: DmMessageType }

      // Set the message for the specific channel
      state.messages[otherUserId] = message
    },
    removeMesageInReply: (state, action) => {
      const { otherUserId } = action.payload
      // Remove the message for the specific channel
      delete state.messages?.[otherUserId]
    }
  }
})

export const { setMesageInReply, removeMesageInReply } =
  dmMessageInReplySlice.actions

export default dmMessageInReplySlice.reducer
