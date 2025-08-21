import axiosServices from '@/utils/axios'

export type CreateClubDataType = {
  clubType: string
  clubName: string
  clubDescription: string
  memberCount: string
  isExistingClub?: boolean
  clubGoal: string
  groupId?: string
}

export const createClub = async (
  data: CreateClubDataType
): Promise<{
  data: {
    success: boolean
    message: string
    data: {
      id: string
      name: string
      uuid: string
      description: string
      clubType: string
      clubName: string
      clubDescription: string
      memberCount: number
      isExistingClub: boolean
      clubGoal: string
      creatorId: string
      groupId: string
      createdAt: string
      updatedAt: string
      creator: {
        id: string
        profile: {
          firstName: string
          lastName: string
          userName: string
          profileImage: string | null
        }
      }
      group: {
        id: string
        name: string
        iconImage: string
      }
    }
  }
}> => {
  return await axiosServices.post(`/v1/tenancy/club/create`, data)
}

export type ClubInfo = {
  id: string
  name: string
  uuid: string
  description: string
  clubType: string
  clubName: string
  clubDescription: string
  memberCount: number
  isExistingClub: boolean
  clubGoal: string
  creatorId: string
  groupId: string
  createdAt: string
  updatedAt: string
}

export type ClubBasicInfoResponse = {
  data: ClubInfo & {
    success: boolean
    message: string
    roles: string[]
  }
}
export const getClubBasicInfo = async (
  clubId: string
): Promise<ClubBasicInfoResponse> => {
  return await axiosServices.get(`/v1/tenancy/club-basic-info-member/${clubId}`)
}
