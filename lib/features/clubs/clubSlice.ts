
import { ClubInfo, getClubBasicInfo } from '@/api/club'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


interface InitialStateProps {
  club: { [key: string]: ClubInfo | undefined } | undefined
  clubUserAcces: { [key: string]: boolean } | undefined
  loading: { [key: string]: boolean }
  clubLoading: {
    [clubId: string]: boolean
  }
  clubLoadingData: {
    [clubId: string]: boolean
  }
}

const InitialState: InitialStateProps = {
  club: {},
  clubUserAcces: {},
  loading: {
    fetchGroupList: false,
    fetchGroupRole: false,
    fetchGroup: false
  },
  clubLoading: {},
  clubLoadingData: {}
}

export const fetchClubBasicInfo = createAsyncThunk(
  'bf/fetchClubBasicInfo',
  async ({ clubId }: { clubId: string }) => {
    try {
      const response = await getClubBasicInfo(clubId)

      if (response?.data) {
        return {
          clubId,
          data: { ...response?.data, roles: response?.data?.roles },
          hasAccess: true
        }
      }
      if (response?.data?.message === 'Unauthorized') {
        return {
          clubId,
          data: undefined,
          hasAccess: false
        }
      }
      return {
        clubId,
        data: undefined,
        hasAccess: false
      }
    } catch (error) {
      console.error('Failed to fetch BF info:', error)
      throw error
    }
  }
)

const clubSlice = createSlice({
  name: 'club',
  initialState: InitialState,
  reducers: {
   
  },
  extraReducers: builder => {
    builder
      .addCase(fetchClubBasicInfo.pending, (state, action) => {
        const { clubId } = action.meta.arg
        state.clubLoading[clubId] = true
        state.clubLoadingData[clubId] = true
      })
      .addCase(fetchClubBasicInfo.fulfilled, (state, action) => {
        const { clubId, data, hasAccess } = action.payload
        state.club = {
          ...state.club,
          [clubId]: data
        }
        state.clubUserAcces = {
          ...state.clubUserAcces,
          [clubId]: hasAccess
        }
        state.clubLoading[clubId] = false
        state.clubLoadingData[clubId] = false
      })
      .addCase(fetchClubBasicInfo.rejected, (state, action) => {
        const { clubId } = action.meta.arg
        state.clubLoading[clubId] = false
        state.clubLoadingData[clubId] = false
      })
  }
})

export const {  } = clubSlice.actions
export default clubSlice.reducer