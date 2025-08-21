import { getEmploymentInfo } from '@/api/user-ekyc/employment'
import { EmploymentInfoType } from '@/types/user-ekyc/employment'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  employment: EmploymentInfoType
  isLoading: boolean
  created: boolean
  loading: boolean
}

const InitialState: InitialStateProps = {
  employment: {
    occupation: '',
    jobTitle: '',
    employerName: '',
    currentWorkAddress: '',
    currentSalary: '',
    sideHustleIncome: '',
    employmentStatus: ''
  },
  isLoading: false,
  created: true,
  loading: false
}

export const fetchEmployment = createAsyncThunk(
  'employment/fetchEmployment',
  async (_, { dispatch }) => {
    try {
      const response = await getEmploymentInfo()
      const employment = response.data.data
      if (employment) {
        dispatch(setEmployment(employment))
        return employment
      }
      return InitialState.employment
    } catch (error: any) {
      if (error.message === 'not-found') {
        dispatch(setCreated(false))
      }
      throw error
    }
  }
)

const employmentSlice = createSlice({
  name: 'employment',
  initialState: InitialState,
  reducers: {
    setEmployment: (state, action) => {
      state.employment = action.payload
    },
    setCreated: (state, action) => {
      state.created = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEmployment.pending, state => {
        state.loading = true
        state.created = true
      })
      .addCase(fetchEmployment.fulfilled, (state, action) => {
        state.loading = false
        state.employment = action.payload
      })
      .addCase(fetchEmployment.rejected, state => {
        state.loading = false
      })
  }
})

export const { setEmployment, setCreated } = employmentSlice.actions

export default employmentSlice.reducer
