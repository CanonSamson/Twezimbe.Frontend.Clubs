import { BasicUserInfo, getBasicUserInfo } from '@/api/basic-profile'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
    basicUserInfo: BasicUserInfo
  isLoading: boolean
  created: boolean
  loading: boolean
}

const InitialState: InitialStateProps = {
  basicUserInfo: {
    firstName: '',
    lastName: '',
    otherNames: '',
    userName: '',
    email: '',
    gender: '',
    maritalStatus: '',
    dateOfBirth: null,
    mobileNumber: '',
    optionalNumber: ''
  },
  isLoading: false,
  created: true,
  loading: false
}

export const fetchBasicUserInfo = createAsyncThunk(
  'basicUser/fetchBasicUserInfo',
  async (_, { dispatch }) => {
    try {
      dispatch(setCreated(true))

      const response = await getBasicUserInfo()
      const basicUserInfo = response.data.data
      if (basicUserInfo) {
        dispatch(setBasicUserInfo(basicUserInfo))
        return basicUserInfo
      }
      return InitialState.basicUserInfo
    } catch (error: any) {
      if (error.message === 'not-found') {
        dispatch(setCreated(false))
      }
      throw error
    }
  }
)

const basicUserInfoSlice = createSlice({
  name: 'basicUserInfo',
  initialState: InitialState,
  reducers: {
    setBasicUserInfo: (state, action) => {
      state.basicUserInfo = action.payload
    },
    setCreated: (state, action) => {
      state.created = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBasicUserInfo.pending, state => {
        state.loading = true
        state.created = true
      })
      .addCase(fetchBasicUserInfo.fulfilled, (state, action) => {
        state.loading = false
        state.created = true
        state.basicUserInfo = action.payload
      })
      .addCase(fetchBasicUserInfo.rejected, state => {
        state.loading = false
      })
  }
})

export const { setBasicUserInfo, setCreated } = basicUserInfoSlice.actions

export default basicUserInfoSlice.reducer
