import { getSocialsInfo } from '@/api/user-profile/socials'
import { SocialsInfoType } from '@/types/user-profile/socials'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  socials: SocialsInfoType
  isLoading: boolean
  created: boolean
  loading: boolean
}

const InitialState: InitialStateProps = {
  socials: {
    linkedin: '',
    facebook: '',
    twitter: '',
    youtube: '',
    website: '',
    instagram: '',
  },
  isLoading: false,
  created: true,
  loading: false
}

export const fetchSocialsInfo = createAsyncThunk(
  'socials/fetchSocials',
  async (_, { dispatch }) => {
    try {
      dispatch(setCreated(true))

      const response = await getSocialsInfo()
      const socials = response.data?.data

      if (socials) {
        dispatch(setSocialsInfo(socials))
        return socials
      }
      return InitialState.socials
    } catch (error: any) {
      if (error.message === 'not-found') {
        dispatch(setCreated(false))
      }
      throw error
    }
  }
)

const socialsSlice = createSlice({
  name: 'socials',
  initialState: InitialState,
  reducers: {
    setSocialsInfo: (state, action) => {
      state.socials = action.payload
    },
    setCreated: (state, action) => {
      state.created = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSocialsInfo.pending, state => {
        state.loading = true
        state.created = true
      })
      .addCase(fetchSocialsInfo.fulfilled, (state, action) => {
        state.loading = false
        state.socials = action.payload
      })
      .addCase(fetchSocialsInfo.rejected, state => {
        state.loading = false
      })
  }
})

export const { setSocialsInfo, setCreated } = socialsSlice.actions

export default socialsSlice.reducer
