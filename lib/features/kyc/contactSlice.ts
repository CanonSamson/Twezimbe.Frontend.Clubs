import { getContactInfo } from '@/api/user-ekyc/contact'
import { ContactInfoType } from '@/types/user-ekyc/contact'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  contact: ContactInfoType
  isLoading: boolean
  created: boolean
  loading: boolean
}

const InitialState: InitialStateProps = {
  contact: {
    nationality: '',
    countryOfResidence: '',
    stateProvinceRegion: '',
    city: '',
    landmark: '',
    zipPostalCode: '',
    addressLine1: '',
    addressLine2: ''
  },
  isLoading: false,
  created: true,
  loading: false
}

export const fetchContact = createAsyncThunk(
  'nextOfKin/fetchContact',
  async (_, { dispatch }) => {
    try {
      dispatch(setCreated(true))

      const response = await getContactInfo()
      const contact = response.data.data
      if (contact) {
        dispatch(setContact(contact))
        return contact
      }
      return InitialState.contact
    } catch (error: any) {
      if (error.message === 'not-found') {
        dispatch(setCreated(false))
      }
      throw error
    }
  }
)

const contactSlice = createSlice({
  name: 'contact',
  initialState: InitialState,
  reducers: {
    setContact: (state, action) => {
      state.contact = action.payload
    },
    setCreated: (state, action) => {
      state.created = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchContact.pending, state => {
        state.loading = true
        state.created = true
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.loading = false
        state.contact = action.payload
      })
      .addCase(fetchContact.rejected, state => {
        state.loading = false
      })
  }
})

export const { setContact, setCreated } = contactSlice.actions

export default contactSlice.reducer
