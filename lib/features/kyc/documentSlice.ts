import { getDocumentInfo } from '@/api/user-ekyc/document'
import { DocumentInfoType } from '@/types/user-ekyc/user-document'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialStateProps {
  document: DocumentInfoType
  isLoading: boolean
  created: boolean
  loading: boolean
}

const InitialState: InitialStateProps = {
  document: {
    documentType: '',
    IdNumber: '',
    frontImage: "",
    backImage: ""
  },
  isLoading: false,
  created: true,
  loading: false
}

export const fetchDocument = createAsyncThunk(
  'document/fetchDocument',
  async (_, { dispatch }) => {
    try {
      dispatch(setCreated(true))

      const response = await getDocumentInfo()
      const document = response.data.data
      if (document) {
        dispatch(setDocument(document))
        return document
      }
      return InitialState.document
    } catch (error: any) {
      if (error.message === 'not-found') {
        dispatch(setCreated(false))
      }
      throw error
    }
  }
)

const documentSlice = createSlice({
  name: 'document',
  initialState: InitialState,
  reducers: {
    setDocument: (state, action) => {
      state.document = action.payload
    },
    setCreated: (state, action) => {
      state.created = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDocument.pending, state => {
        state.loading = true
        state.created = true
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.loading = false
        state.document = action.payload
      })
      .addCase(fetchDocument.rejected, state => {
        state.loading = false
      })
  }
})

export const { setDocument, setCreated } = documentSlice.actions

export default documentSlice.reducer
