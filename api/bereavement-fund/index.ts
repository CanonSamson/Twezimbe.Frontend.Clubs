import axiosServices from '@/utils/axios'

export type CreateBfDTO = {
  name: string
  fundDetails: string
  type: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  mobileMoneyNumber?: string
  mobileMoneyName?: string
  accountType?: string
}
export type UpdateBfBasicInfoDTO = {
  name?: string
  fundDetails?: string
  type?: string
  allowTransition?: boolean
}

export type CreateBfResponse = {
  data: {
    success: boolean
    fundId: string
  }
}

export const createBf = async (
  data: CreateBfDTO,
  groupId: string
): Promise<CreateBfResponse> => {
  return await axiosServices.post(`/v1/tenancy/bf/${groupId}`, data)
}

export const updateBfBasicInfo = async (
  data: UpdateBfBasicInfoDTO,
  fundId: string
): Promise<CreateBfResponse> => {
  return await axiosServices.put(`/v1/tenancy/bf/fund/${fundId}`, data)
}

export type BfInfo = {
  id: string
  name: string
  fundDetails: string
  type: string
  allowTransition: boolean
  baseCurrency: 'UGX'
  member: {
    id: string
    membershipPaid: boolean
    isClosedPendingModal: boolean
    isTransitioned: boolean
    isTransitionMember: boolean
  } | null
  roles: string[]
}
export type BfBasicInfoResponse = {
  data: {
    success: boolean
    message: string
    fund: BfInfo
    roles: string[]
  }
}
export const getBfBasicInfo = async (
  fundId: string
): Promise<BfBasicInfoResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-fund-basic-info-member/${fundId}`
  )
}

export const getBfFundInkindContributionDetails = async (
  fundId: string
): Promise<{
  data: {
    data: {
      inKindContribution: string | null
      inKindContributions: {
        fundRuleId: string
        attendanceVigil: boolean | null
        attendanceRequiemMass: boolean | null
        attendanceBurial: boolean | null
        attendancePostDeathVisit: boolean | null
      } | null
    }
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/bf/fund/${fundId}/in-kind-contributions`
  )
}

export const getSubscriptionStats = async (
  fundId: string
): Promise<{
  data: {
    success: boolean
    stats: {
      id: string
      fundId: string
      fundDetails: string
      name: string
      maxBeneficiariesPerPrincipal: number
      membershipFee: number
      caseActions: number
      principalBenefit: number
      spouseBenefit: number
      childBenefit: number
      parentsBenefit: number
      annualSubscription: number
      othersBenefit: number
      waitingPeriod: string
      subscription: {
        adult: number
        youth: number
        seniors: number
        preSeniors: number
        youngChildren: number
      }
      cashContribution: number
      inKindContribution: string
      paymentInLieuOfFailure: number
      benefits: {
        payoutPool: number
        adminCostCap: number
        reserveRatio: number
        mortalityRate: number
      }
      updatedAt: string
      createdAt: string
      inKindContributions: {
        fundRuleId: string
        attendanceVigil: boolean | null
        attendanceRequiemMass: boolean | null
        attendanceBurial: boolean | null
        attendancePostDeathVisit: boolean | null
      } | null
      benefitciaryFee: number
    }
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/bf/fund/${fundId}/subscription-stats`
  )
}

export const getMemberSubscriptionStats = async (
  fundId: string
): Promise<{
  data: {
    stats: {
      benefitciaryFee: number
      inKindContribution: string | null
      membershipFee: number
      annualSubscription: number
      totalPaidFee: number
      totalDueFee: number
      inKindContributions: {
        fundRuleId: string
        attendanceVigil: boolean | null
        attendanceRequiemMass: boolean | null
        attendanceBurial: boolean | null
        attendancePostDeathVisit: boolean | null
      } | null
    }
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/bf/fund/${fundId}/member-subscription-stats`
  )
}

export const closeBfPendingModal = async (
  fundId: string
): Promise<{
  data: {
    closed?: boolean
  }
}> => {
  return await axiosServices.patch(
    `/v1/tenancy/bf/fund/${fundId}/close-pending-modal`
  )
}
