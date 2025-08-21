import axiosServices from '@/utils/axios'
import { User } from './signin'

export type UserDataResponse = {
  data: {
    meesage: string,
    user: User,
    updatedProfile: {
      inviteId: string | null
    }
  }
}

export const getUser = async (): Promise<UserDataResponse> => {
  return await axiosServices.get(`/v1/tenancy/auth/user`)
}

export type OtherUserProfileResponse = {
  data: {
    meesage: string
    user: {
      profile: {
        firstName: string
        lastName: string
        userName: string
        profileImage: string | null
        bio: string | null
        socials: null | any
      }
      groups: Array<{
        id: string
        name: string
        description: string
        iconImage: string
      }>
    }
  }
}

export const getOtherUserProfile = async (
  userId: string
): Promise<OtherUserProfileResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/user/${userId}/other-user-profile`
  )
}

export type UserProfileResponse = {
  data: {
    user: {
      groups: Array<{
        id: string;
        name: string;
        description: string;
        iconImage: string;
      }>;
      firstName: string;
      lastName: string;
      userName: string;
      profileImage: string;
      bio: string;
      socials: {
        id: string;
        facebook: string;
        twitter: string;
        linkedin: string;
        youtube: string;
        instagram: string;
        website: string;
        profileId: string | null;
      };
    }
  }
}

export const getUserProfile = async (
  userId: string,
  params: { [key: string]: any }
): Promise<UserProfileResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/user/${userId}/profile`, {params}
  )
}

export const getSuggectedUserName = async (
  email: string
): Promise<{ data: string[] }> => {
  return await axiosServices.get(`/v1/tenancy/auth/suggect/user-name`, {
    params: { email }
  })
}

export const updateUserName = async (data: {
  userName: string
}): Promise<UserDataResponse> => {
  return await axiosServices.put(`/v1/tenancy/auth/update/user-name`, data)
}


