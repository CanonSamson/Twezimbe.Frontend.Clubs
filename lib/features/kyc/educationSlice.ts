import { getEducationInfo } from '@/api/user-ekyc/education'
import { EducationInfoType } from '@/types/user-ekyc/education'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  education: EducationInfoType
  isLoading: boolean
  created: boolean
  loading: boolean
}

const InitialState: InitialStateProps = {
  education: {
    certifications: '',
    yearAttended: '',
    highestEducationLevel: '',
    institution: ''
  },
  isLoading: false,
  created: true,
  loading: false
}

export const fetchEducation = createAsyncThunk(
  'education/fetchEducation',
  async (_, { dispatch }) => {
    try {
      const response = await getEducationInfo()
      const education = response.data.data
      if (education) {
        dispatch(setEducation(education))
        return education
      }
      return InitialState.education
    } catch (error: any) {
      if (error.message === 'not-found') {
        dispatch(setCreated(false))
      }
      throw error
    }
  }
)

const educationSlice = createSlice({
  name: 'education',
  initialState: InitialState,
  reducers: {
    setEducation: (state, action) => {
      state.education = action.payload
    },
    setCreated: (state, action) => {
      state.created = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEducation.pending, state => {
        state.loading = true
        state.created = true
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.loading = false
        state.education = action.payload
      })
      .addCase(fetchEducation.rejected, state => {
        state.loading = false
      })
  }
})

export const { setEducation, setCreated } = educationSlice.actions

export default educationSlice.reducer
