import axiosServices from '@/utils/axios'

export type SignInDTO = {
  email: string
  password: string
}

export type PasswordLessDTO = {
  system: string
  email: string
}
export type User = {
  id: string
  emailVerified: boolean
  role: UserRole[]
  profile: {
    verified: boolean
    email: string
    lastName: string
    firstName: string
    profileImage: null | string
    userName: null | string
  }
  settings: {
    skippedBio: boolean | null
    notificationSettings: {
      notifyOnMention: boolean
      notifyOnDirectMessage: boolean
      notifyOnReaction: boolean
      notifyOnOtherEvents: boolean
    }
  } | null
}

export type UserRole = 'USER' | ''

export type SkippedBioResponse = {
  data: {
    success: boolean
  }
}

export const skippedBio = async (): Promise<SkippedBioResponse> => {
  return await axiosServices.post('/v1/tenancy/user-settings/skip-bio')
}
