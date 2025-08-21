import axiosServices from '@/utils/axios'

export type BfTransitionDataType = {
  amount: number
  fundId: string
  createdAt: Date
  note: string | null
  userId: string
  id: string
  status: string
  acceptedAt: Date | null
  document: any | null
  rejectionReason: string | null
  isNegativeBalance: boolean
  dateJoined?: Date
  admin: {
    id: string
    firstName: string
    lastName: string
    userName: string
  } | null
}
export const createTransitionMember = async (
  fundId: string,
  data: {
    userId: string
    note?: string
    amount: number
    documentUrl: string
    dateJoined: string
  }
): Promise<{
  data: {
    data: BfTransitionDataType
    success: boolean
  }
}> => {
  return await axiosServices.post(
    `/v1/tenancy/bf-transition/fund/${fundId}/transition-members`,
    data
  )
}

export const acceptTransition = async (
  fundId: string,
  data: {
    acceptedBy: string
    acceptanceNote: string
    memberId: string
  }
): Promise<{
  data: {
    data: BfTransitionDataType
    success: boolean
  }
}> => {
  return await axiosServices.put(
    `/v1/tenancy/bf-transition/fund/${fundId}/transition/accept`,
    data
  )
}

export const rejectTransition = async (
  fundId: string,
  data: {
    rejectedBy: string
    rejectionReason: string
    memberId: string
  }
): Promise<{
  data: {
    data: BfTransitionDataType
    success: boolean
  }
}> => {
  return await axiosServices.put(
    `/v1/tenancy/bf-transition/fund/${fundId}/transition/reject`,
    data
  )
}

export const getTransitionMember = async (
  fundId: string,
  filters?: {
    page?: number
    limit?: number
    sortBy?: string
    search?: string
    status?: string
  }
): Promise<{
  data: {
    data: {
      members: any[]
      pagination: {
        currentPage: number
        hasNextPage: number
        hasPreviousPage: number
        limit: number
        totalCount: number
        totalPages: number
      }
    }
    success: boolean
  }
}> => {
  const params = {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    sortBy: filters?.sortBy || 'createdAt',
    ...(filters?.search && { search: filters.search }),
    ...(filters?.status && { status: filters.status })
  }
  
  return await axiosServices.get(
    `/v1/tenancy/bf-transition/fund/${fundId}/transition-members`,
    { params }
  )
}

export const getTransitionMemberData = async (
  fundId: string
): Promise<{
  data: {
    data: BfTransitionDataType
    success: boolean
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-transition/fund/${fundId}/user-transition-data`
  )
}

export const getTransitionTotalDuePayments = async (
  fundId: string
): Promise<{
  data: {
    data: {
      totalDuePayments: number
    }
    success: boolean
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-transition/fund/${fundId}/transition/total-due-payments`
  )
}

export const getBfTransitionTotalStats = async (
  fundId: string
): Promise<{
  data: {
    data: {
      totalDuePayments: number
      totalPending: number
      totalPaid: number
    }
    success: boolean
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-transition/fund/${fundId}/transition/stats`
  )
}

export const payNegativeTransitionBalance = async (
  fundId: string,
  transitionId: string
): Promise<{
  data: {
    success: boolean
  }
}> => {
  return await axiosServices.post(
    `/v1/payments/bf-transition/negative-bf-transitions/payments`,
    { fundId, transitionId }
  )
}

export const deleteTransitionMember = async (
  fundId: string,
  memberUserId: string
): Promise<{
  data: {
    success: boolean
  }
}> => {
  return await axiosServices.delete(
    `/v1/tenancy/bf-transition/fund/${fundId}/transition-member/${memberUserId}`
  )
}
