import {
  CreateEducationInfoType,
  EducationInfoType,
  UpdateEducationInfoType
} from '@/types/user-ekyc/education'
import axiosServices from '@/utils/axios'

export type EducationInfoResponse = {
  data: {
    
    data: EducationInfoType
  }
}

export type UpdateEducationInfoResponse = {
  data: {
    completed: boolean
    success: boolean
    data: EducationInfoType
  }
}

export type CreateEducationInfoResponse = {
  data: {
    completed: boolean

    success: boolean
    data: EducationInfoType
  }
}

export const getEducationInfo = async (): Promise<EducationInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/education')
}

export const updateEducationInfo = async (
  data: UpdateEducationInfoType
): Promise<UpdateEducationInfoResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/education', data)
}

export const createEducationInfo = async (
  data: CreateEducationInfoType
): Promise<CreateEducationInfoResponse> => {
  return await axiosServices.post('/v1/ekyc/post/user/education', data)
}
