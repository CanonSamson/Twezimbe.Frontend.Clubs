import axiosServices from '@/utils/axios'
import { UploadImageResponse } from '.'

export const uploadUserProfile = async (
  file: File
): Promise<UploadImageResponse> => {
  if (!file) {
    throw new Error('No file provided.')
  }

  const formData = new FormData()
  formData.append('userProfile', file)
  return await axiosServices.post(
    '/v1/tenancy/upload-file/image/user-profile',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}
