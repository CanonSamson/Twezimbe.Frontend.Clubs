import {
  CreateEmploymentInfoType,
  EmploymentInfoType,
  UpdateEmploymentInfoType
} from '@/types/user-ekyc/employment'
import axiosServices from '@/utils/axios'

export type EmploymentInfoResponse = {
  data: {
    data: EmploymentInfoType
  }
}

export type UpdateEmploymentInfoResponse = {
  data: {
    completed: boolean

    success: boolean
    data: EmploymentInfoType
  }
}

export type CreateEmploymentInfoResponse = {
  data: {
    completed: boolean

    success: boolean

    data: EmploymentInfoType
  }
}

export const getEmploymentInfo = async (): Promise<EmploymentInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/employment')
}

export const updateEmploymentInfo = async (
  data: UpdateEmploymentInfoType
): Promise<UpdateEmploymentInfoResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/employment', data)
}

export const createEmploymentInfo = async (
  data: CreateEmploymentInfoType
): Promise<CreateEmploymentInfoResponse> => {
  return await axiosServices.post('/v1/ekyc/post/user/employment', data)
}
