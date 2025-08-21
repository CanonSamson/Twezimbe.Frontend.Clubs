import axiosServices from '@/utils/axios'

export type UploadImageResponse = {
  data: {
    success: boolean
    url: string
    message: string
  }
}

export const uploadFile = async (file: File): Promise<UploadImageResponse> => {
  if (!file) {
    throw new Error('No file provided.')
  }

  const formData = new FormData()
  formData.append('file', file)
  return await axiosServices.post('/v1/tenancy/upload-file/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
