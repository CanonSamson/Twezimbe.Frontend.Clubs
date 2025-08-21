import {
  DocumentInfoType,
  UpdateDocumentInfoType
} from '@/types/user-ekyc/user-document'
import axiosServices from '@/utils/axios'

export type DocumentInfoResponse = {
  data: {
    data: DocumentInfoType
  }
}

export type UpdateDocumentInfoResponse = {
  data: {
    completed: boolean

    success: boolean
    data: DocumentInfoType
  }
}

export type CreateDocumentInfoResponse = {
  data: {
    completed: boolean

    success: boolean
    data: DocumentInfoType
  }
}

export const getDocumentInfo = async (): Promise<DocumentInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/document')
}

export const updateDocumentInfo = async (
  data: UpdateDocumentInfoType
): Promise<UpdateDocumentInfoResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/document', data)
}

