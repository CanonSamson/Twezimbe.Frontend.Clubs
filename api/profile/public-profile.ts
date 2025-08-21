import axiosServices from '@/utils/axios'

export type PublicProfileInfoResponse = {
  data: {
    data: PublicProfileInfo | null
  }
}

export type PublicProfileInfo = {
  firstName: string
  lastName: string
  userName?: string
  yourName?: string
  bio?: string
}

export type UpdatePublicProfileInfoResponse = {
  data: {
    success: boolean
    data: PublicProfileInfo
  }
}

export const getPublicProfileInfo =
  async (): Promise<PublicProfileInfoResponse> => {
    return await axiosServices.get('/v1/ekyc/user/public-profile-info')
  }

export const updatePublicProfileInfo = async (
  data: PublicProfileInfo
): Promise<UpdatePublicProfileInfoResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/public-profile-info', data)
}
