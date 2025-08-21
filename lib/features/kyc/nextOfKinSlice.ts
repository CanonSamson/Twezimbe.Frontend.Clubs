import { getNextOfKinInfo } from '@/api/ekyc'
import { NextOfKinType } from '@/types/kyc'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  nextOfKin: NextOfKinType
  isLoading: boolean
  created: boolean
  loading: boolean
}

const InitialState: InitialStateProps = {
  nextOfKin: {
    fullName: '',
    phone1: '',
    phone2: '',
    email1: '',
    email2: '',
    address: '',
    gender: '',
    relationship: ''
  },
  isLoading: false,
  created: true,
  loading: false
}

export const fetchNextOfKin = createAsyncThunk(
  'nextOfKin/fetchNextOfKin',
  async (_, { dispatch }) => {
    try {
      const response = await getNextOfKinInfo()
      const kin = response.data.data
      if (kin) {
        dispatch(setNextOfKin(kin))
        return kin
      }
      return InitialState.nextOfKin
    } catch (error: any) {
      if (error.message === 'not-found') {
        dispatch(setCreated(false))
      }
      throw error
    }
  }
)

const nextOfKinSlice = createSlice({
  name: 'nextOfKin',
  initialState: InitialState,
  reducers: {
    setNextOfKin: (state, action) => {
      state.nextOfKin = action.payload
    },
    setCreated: (state, action) => {
      state.created = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNextOfKin.pending, state => {
        state.loading = true
        state.created = true
      })
      .addCase(fetchNextOfKin.fulfilled, (state, action) => {
        state.loading = false
        state.nextOfKin = action.payload
      })
      .addCase(fetchNextOfKin.rejected, state => {
        state.loading = false
      })
  }
})

export const { setNextOfKin, setCreated } = nextOfKinSlice.actions

export default nextOfKinSlice.reducer
