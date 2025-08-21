import axiosServices from '@/utils/axios'



export type UploadFile = {
  data: {
    success: boolean
    url: string
    message: string
    files: {
      originalName: string
      url: string
    }
  }
}

export const uploadFile = async (files: File[]): Promise<UploadFile> => {
  if (!files || files.length === 0) {
    throw new Error('No files provided.')
  }
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })
  return await axiosServices.post('/v1/tenancy/upload-file/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export type UploadFiles = {
  data: {
    success: boolean
    url: string
    message: string
    files: {
      originalName: string
      url: string
    }[]
  }
}
export const uploadFiles = async (files: File[]): Promise<UploadFiles> => {
  if (!files || files.length === 0) {
    throw new Error('No files provided.')
  }
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })
  return await axiosServices.post('/v1/tenancy/upload-file/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


export const getSignedUrl = async (data: {
  publicId: string, resourceType: "raw"
}): Promise<UploadFiles> => {
  return await axiosServices.post('/v1/tenancy/upload-file/get-signed-url', data)
}

