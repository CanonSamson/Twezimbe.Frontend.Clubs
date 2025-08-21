import { createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  user: {
    [id: string]: {
      [userId: string]: {
        id: string
        firstName: string
      }
    }
  }
}
// First, add loading state to InitialState
const InitialState: InitialStateProps = {
  user: {}
}

// Add these cases in extraReducers
const typingSlice = createSlice({
  name: 'typing',
  initialState: InitialState,
  reducers: {
    setUserIsTyping: (state, action) => {
      const { id, user } = action.payload

      // Initialize group if it doesn't exist
      if (!state.user[id]) {
        state.user[id] = {} // Initialize the group first
      }

      // Set the message for the specific channel
      state.user[id][user?.id] = user
    },
    setUserIsNotTyping: (state, action) => {
      const { id, user } = action.payload

      // Initialize group if it doesn't exist
      if (!state.user[id]) {
        state.user[id] = {} // Initialize the group first
      }

      // Set the message for the specific channel
      delete state.user[id][user?.id]
    },
    userIsNotTyping: (state, action) => {
      const { id, userId } = action.payload
      // Remove the specific user's typing status
      if (state.user[id] && state.user[id][userId]) {
        delete state.user[id][userId]

        // Clean up empty groups
        if (Object.keys(state.user[id]).length === 0) {
          delete state.user[id]
        }
      }
    }
  }
})

export const { setUserIsTyping, userIsNotTyping, setUserIsNotTyping } = typingSlice.actions

export default typingSlice.reducer
