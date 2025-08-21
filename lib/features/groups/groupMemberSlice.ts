import { getGroupMembers, GroupMemberType } from '@/api/group'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  loading: { [key: string]: boolean }
  members: {
    [groupId: string]: GroupMemberType[] | undefined
  }
}

const InitialState: InitialStateProps = {
  loading: {
    fetchGroupMembers: false
  },
  members: {}
}

export const fetchGroupMembers = createAsyncThunk(
  'group/fetchGroupMembers',
  async ({ groupId }: { groupId: string }) => {
    try {
      const response = await getGroupMembers(groupId, { role: "everyone"})
      return { groupId, members: response?.data?.members }
    } catch (error) {
      console.error('Failed to fetch group members:', error)
      throw error
    }
  }
)

const groupMemberSlice = createSlice({
  name: 'groupMembers',
  initialState: InitialState,
  reducers: {
    setGroupMembers: (state, action) => {
      const { groupId, members } = action.payload
      state.members[groupId] = members.reduce(
        (acc: any, member: GroupMemberType) => ({
          ...acc,
          [member.user.id]: member
        }),
        {}
      )
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGroupMembers.pending, state => {
        state.loading.fetchGroupMembers = true
      })
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.loading.fetchGroupMembers = false
        const { groupId, members } = action.payload
        state.members[groupId] = members
      })
      .addCase(fetchGroupMembers.rejected, state => {
        state.loading.fetchGroupMembers = false
      })
  }
})

export const { setGroupMembers } = groupMemberSlice.actions
export default groupMemberSlice.reducer
