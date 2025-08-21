import {
  SocialsInfoType,
  UpdateSocialsInfoType
} from '@/types/user-profile/socials'
import axiosServices from '@/utils/axios'

export type SocialsInfoResponse = {
  data: {
    data: SocialsInfoType
  }
}

export type UpdateSocialsInfoResponse = {
  data: {
    completed: boolean
    success: boolean
    user: SocialsInfoType
  }
}

export type CreateSocialsInfoResponse = {
  data: {
    completed: boolean
    success: boolean
    data: SocialsInfoType
  }
}

export const getSocialsInfo = async (): Promise<SocialsInfoResponse> => {
  return await axiosServices.get('/v1/tenancy/user/get/socials-info')
}

export const updateSocialsInfo = async (
  data: UpdateSocialsInfoType
): Promise<UpdateSocialsInfoResponse> => {
  return await axiosServices.put(
    `/v1/tenancy/user/update/socials-info`,
    data
  )
}
