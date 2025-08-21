import { BfInfo, getBfBasicInfo } from '@/api/bereavement-fund'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


interface InitialStateProps {
  bf: { [key: string]: BfInfo | undefined } | undefined
  bfUserAcces: { [key: string]: boolean } | undefined
  loading: { [key: string]: boolean }
  bfLoading: {
    [fundId: string]: boolean
  }
  bfLoadingData: {
    [fundId: string]: boolean
  }
}

const InitialState: InitialStateProps = {
  bf: {},
  bfUserAcces: {},
  loading: {
    fetchGroupList: false,
    fetchGroupRole: false,
    fetchGroup: false
  },
  bfLoading: {},
  bfLoadingData: {}
}

export const fetchBfBasicInfo = createAsyncThunk(
  'bf/fetchBfBasicInfo',
  async ({ fundId }: { fundId: string }) => {
    try {
      const response = await getBfBasicInfo(fundId)

      if (response?.data?.fund) {
        return {
          fundId,
          data: { ...response?.data?.fund, roles: response?.data?.roles },
          hasAccess: true
        }
      }
      if (response?.data?.message === 'Unauthorized') {
        return {
          fundId,
          data: undefined,
          hasAccess: false
        }
      }
      return {
        fundId,
        data: undefined,
        hasAccess: false
      }
    } catch (error) {
      console.error('Failed to fetch BF info:', error)
      throw error
    }
  }
)

const bfSlice = createSlice({
  name: 'bf',
  initialState: InitialState,
  reducers: {
    togglePendingModal: (state, action) => {
      const { isClosed, bfId } = action.payload
      
      // Ensure bf object exists
      if (!state.bf) {
        state.bf = {}
      }
      
      // Ensure the specific fund exists
      if (!state.bf[bfId]) {
        return // Can't update what doesn't exist
      }
      
      // Update the isClosedPendingModal property
      state.bf[bfId] = {
        ...state.bf[bfId],
        member: {
          ...state.bf[bfId]?.member,
          id: state.bf[bfId]?.member?.id || '',
          membershipPaid: state.bf[bfId]?.member?.membershipPaid || false,
          isClosedPendingModal: isClosed,
          isTransitioned: state.bf[bfId]?.member?.isTransitioned || false,
          isTransitionMember: state.bf[bfId]?.member?.isTransitionMember || false
        }
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBfBasicInfo.pending, (state, action) => {
        const { fundId } = action.meta.arg
        state.bfLoading[fundId] = true
        state.bfLoadingData[fundId] = true
      })
      .addCase(fetchBfBasicInfo.fulfilled, (state, action) => {
        const { fundId, data, hasAccess } = action.payload
        state.bf = {
          ...state.bf,
          [fundId]: data
        }
        state.bfUserAcces = {
          ...state.bfUserAcces,
          [fundId]: hasAccess
        }
        state.bfLoading[fundId] = false
        state.bfLoadingData[fundId] = false
      })
      .addCase(fetchBfBasicInfo.rejected, (state, action) => {
        const { fundId } = action.meta.arg
        state.bfLoading[fundId] = false
        state.bfLoadingData[fundId] = false
      })
  }
})

export const { togglePendingModal } = bfSlice.actions
export default bfSlice.reducer