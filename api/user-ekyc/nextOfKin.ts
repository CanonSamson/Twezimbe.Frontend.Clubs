import { NextOfKinType } from '@/types/kyc'
import { CreateNextOfKinType , UpdateNextOfKinType} from '@/types/user-ekyc/nextOfKin'
import axiosServices from '@/utils/axios'


export type NextOfKinInfoResponse = {
  data: {
    data: NextOfKinType | null
  }
}
export type NextOfKinInfoCreateResponse = {
  data: {
    completed: boolean

    success: boolean
    data: NextOfKinType
  }
}


export const getNextOfKinInfo = async (): Promise<NextOfKinInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/next-of-kin')
}

export const createNextOfKinInfo = async (
  data: CreateNextOfKinType
): Promise<NextOfKinInfoCreateResponse> => {
  return await axiosServices.post('/v1/ekyc/post/user/next-of-kin', data)
}
export const updateNextOfKinInfo = async (
  data: UpdateNextOfKinType
): Promise<NextOfKinInfoCreateResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/next-of-kin', data)
}


