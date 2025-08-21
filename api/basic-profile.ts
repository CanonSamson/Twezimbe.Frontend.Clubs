import axiosServices from '@/utils/axios'

export type BasicUserInfoResponse = {
  data: {
    data: {
      firstName: string
      email: string
      userName: string | null
      lastName: string
      gender: string | null
      maritalStatus: string | null
      otherNames: string | null
      dateOfBirth: Date | null
      mobileNumber: string | null
      optionalNumber: string | null
    } | null
  }
}

export type BasicUserInfo = {
  firstName?: string
  email?: string
  userName?: string | null
  lastName?: string
  gender?: string | null
  maritalStatus?: string | null
  otherNames?: string | null
  dateOfBirth?: Date | null
  mobileNumber?: string | null
  optionalNumber?: string | null
  profileImage?: string | null
  bio?: string
}


export type UpdateBasicUserInfoResponse = {
  data: {
    success: boolean
    data: BasicUserInfo
  }
}

export const getBasicUserInfo = async (): Promise<BasicUserInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/user/basic-info')
}

export const updateBasicUserInfo = async (
  data: BasicUserInfo
): Promise<UpdateBasicUserInfoResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/basic-info', data)
}
