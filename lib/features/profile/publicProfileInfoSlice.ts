import { PublicProfileInfo, getPublicProfileInfo } from '@/api/profile/public-profile'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
    publicProfileInfo: PublicProfileInfo
  isLoading: boolean
  created: boolean
  loading: boolean
}

const InitialState: InitialStateProps = {
  publicProfileInfo: {
    firstName: '',
    lastName: '',
    yourName: '',
    userName: '',
    bio: '',
  },
  isLoading: false,
  created: true,
  loading: false
}

export const fetchPublicProfileInfo = createAsyncThunk(
  'publicProfile/fetchPublicProfile',
  async (_, { dispatch }) => {
    try {
      dispatch(setCreated(true))

      const response = await getPublicProfileInfo()
      const publicProfileInfo = response.data.data
      if (publicProfileInfo) {
        dispatch(setPublicProfileInfo(publicProfileInfo))
        return publicProfileInfo
      }
      return InitialState.publicProfileInfo
    } catch (error: any) {
      if (error.message === 'not-found') {
        dispatch(setCreated(false))
      }
      throw error
    }
  }
)

const publicProfileInfoSlice = createSlice({
  name: 'publicProfileInfo',
  initialState: InitialState,
  reducers: {
    setPublicProfileInfo: (state, action) => {
      state.publicProfileInfo = action.payload
    },
    setCreated: (state, action) => {
      state.created = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPublicProfileInfo.pending, state => {
        state.loading = true
        state.created = true
      })
      .addCase(fetchPublicProfileInfo.fulfilled, (state, action) => {
        state.loading = false
        state.created = true
        state.publicProfileInfo = action.payload
      })
      .addCase(fetchPublicProfileInfo.rejected, state => {
        state.loading = false
      })
  }
})

export const { setPublicProfileInfo, setCreated } = publicProfileInfoSlice.actions

export default publicProfileInfoSlice.reducer
