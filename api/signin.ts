import axiosServices from '@/utils/axios'

export type SignInDTO = {
  email: string
  password: string
  inviteId?:string
}

export type PasswordLessDTO = {
  system: string
  email: string
}
export type User = {
  id: string
  emailVerified: boolean
  role: UserRole[]
  favoriteEmoji?: string[]
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

export type SignInResponse = {
  data: {
    success: boolean
    token: string
    user: User
    message: string
  }
}
export type SignUp = {
  success: boolean
  token: string
}

export const googleSignIn = async (): Promise<SignInResponse> => {
  return await axiosServices.get('/v1/tenancy/auth/google')
}

export const signIn = async (data: SignInDTO): Promise<SignInResponse> => {
  return await axiosServices.post('/v1/tenancy/auth/signin', data)
}
