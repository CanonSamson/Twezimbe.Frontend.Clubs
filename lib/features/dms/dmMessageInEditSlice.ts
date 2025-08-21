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
const dmMessageInEditSlice = createSlice({
  name: 'dmMessageInEdit',
  initialState: InitialState,
  reducers: {
    setMesageInEdit: (state, action) => {
      const { otherUserId, message } = action.payload
      // Set the message for the specific channel
      state.messages[otherUserId] = message
    },
    removeMesageInEdit: (state, action) => {
      const { otherUserId } = action.payload
      // Remove the message for the specific channel
      delete state.messages?.[otherUserId]
    }
  }
})

export const { setMesageInEdit, removeMesageInEdit } =
  dmMessageInEditSlice.actions

export default dmMessageInEditSlice.reducer
