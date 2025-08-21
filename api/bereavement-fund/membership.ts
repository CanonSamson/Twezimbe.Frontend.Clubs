import axiosServices from '@/utils/axios'

export interface OneTimeMembershipResponse {
  data: {
    success: boolean
    message: string
    data: {
      id: string
      fundId: string
      status: 'PENDING' | 'PAID' | 'FAILED'
      name: string
      paidAmount: number
      nextPaymentDate: string | null
      paymentDate: string | null
      lastPaymentDate:  string | null
      nextDueDate: string | null
      createdAt: string
      userId: string
      updatedAt: string
      membershipFee: number
      user: {
        profile: {
          firstName: string
          lastName: string
        }
      }
    }
  }
}

export const getFundOneTimeMembership = async (
  fundId: string
): Promise<OneTimeMembershipResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-subscription/fund/${fundId}/one-time-membership`
  )
}


export const getBfMemberMonthlyMemberShipSubscription = async (
  fundId: string
): Promise<OneTimeMembershipResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-subscription/fund/${fundId}/monthly-membership`
  )
}
