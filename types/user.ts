import { UserRole } from './role'

export type User = {
  id: string | null
  emailVerified: boolean
  isKyc: boolean
  role: UserRole[]
  profile: UserProfile
  settings: UserSettings | null
  favoriteEmoji?: string[]
}

export type UserProfile = {
  verified: boolean
  email: string | null
  lastName: string | null
  firstName: string | null
  profileImage: null | string
  userName: null | string
  bio: null | string
}

export type UserSettings = {
  skippedBio: boolean | null
  notificationSettings: {
    notifyOnMention: boolean
    notifyOnDirectMessage: boolean
    notifyOnReaction: boolean
    notifyOnOtherEvents: boolean
  }
}
