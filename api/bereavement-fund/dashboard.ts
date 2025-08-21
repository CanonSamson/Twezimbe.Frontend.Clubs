// ... existing imports and types ...

import axiosServices from '@/utils/axios'

export interface DashboardStats {
  fundStats: {
    totalMembers: number
    totalContributions: number
    totalClaims: number
    totalPendingClaims: number
    totalApprovedClaims: number
    totalRejectedClaims: number
    wallet: {
      id: string
      fundId: string
      uuid: string
      balance: number
      updatedAt: string
      createdAt: string
    }
  }
  memberStats: {
    totalContributions: number
    totalClaims: number
    lastContribution: {
      amount: number
      date: string
    } | null
    lastClaim: {
      amount: number
      date: string
      status: string
    } | null
  }
}

export type DashboardStatsResponse = {
  data: {
    success: boolean
    message: string
    stats: DashboardStats
  }
}

export type FundStatsResponse = {
  data: {
    success: boolean
    message: string
    data: {
      totalBalance: number
      totalBeneficiaries: number
      totalCases: number
      totalContributions: number
      totalContributors: number
      totalMembers: number
      totalUserContributionsAmount: number
      totalContributionsAmount: number
      totalUserContributions: number,
      totalPayout: number
      totalDeaths: number
      wallet: {
        id: string
        fundId: string
        uuid: string
        balance: number
        updatedAt: string
        createdAt: string
      }
    }
  }
}


export interface RiskProfile {
  age: number;
  ageCategory: string;
  ageRang: {
    from: number;
    to: number;
  };
  riskProfile: number;
  subscriptionFee: number;
}

export type BeneficiaryFundStatsResponse = {
  data: {
    success: boolean
    message: string
    data: {
      riskProfile: RiskProfile
      totalPayout: number
    }
  }
}

export type MemberStatsResponse = {
  data: {
    success: boolean
    message: string
    stats: DashboardStats['memberStats']
  }
}


export type PrincipalMembershipResponse = {
  data: {
    success: boolean
    message: string
    data: {
      data: {
        id: string;
        userId: string;
        firstName: string | undefined;
        lastName: string | undefined;
        profileImage: string | null | undefined;
        membershipPaid: boolean
        userName: string | null | undefined;
        totalFiledCases: number;
        paymentMode: string;
        annualSubscription: [{
          status: string
        }]
        membershipFee: {
          status: string
        }
        totalPayout: number,
        totalContributions: number
        membershipPaidAmount: number
      }[]
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      }
    }
  }
}

export type BeneficiaryPrincipalsResponse = {
  data: {
    success: boolean
    principals: {
      id: string;
      userId: string;
      firstName: string | undefined;
      lastName: string | undefined;
      profileImage: string | null | undefined;
      membershipPaid: boolean
      userName: string | null | undefined;
      createdAt: string
    }[]
  }
}

export const getDashboardStats = async (
  fundId: string
): Promise<DashboardStatsResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-dashboard/fund/${fundId}/dashboard`
  )
}



export const getFundStats = async (
  fundId: string
): Promise<FundStatsResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-dashboard/fund/${fundId}/stats`
  )
}


export interface SubscriptionPoolAllocationPercentages {
  claimsPool: string;   // e.g. "60.0%"
  reserves: string;     // e.g. "30.0%"
  adminCosts: string;   // e.g. "10.0%"
}

export interface SubscriptionPoolAllocationData {
  totalPool: number;
  claimsPool: number;
  reserves: number;
  adminCosts: number;
  isValid: boolean;
  percentages: SubscriptionPoolAllocationPercentages;
}

export interface SubscriptionPoolAllocationResponse {
  data: {
    success: boolean;
    data: SubscriptionPoolAllocationData;
  }
}


export const getSubscriptionPoolAllocation = async (
  fundId: string
): Promise<SubscriptionPoolAllocationResponse> => {
  return await axiosServices.get(
    `/v1/accounting/bf-computation/fund/${fundId}/subscription-pool-allocation`
  )
}


export const calculateMemberProportionalPayout = async (
  fundId: string
): Promise<{
  data: {
    data: {
      memberContributions: number
      payout: number
    }
  }
}> => {
  return await axiosServices.get(
    `/v1/accounting/bf-computation/fund/${fundId}/member/proportional-payout`
  )
}
export const calculateUserProportionalPayout = async (
  fundId: string,
  userId: string
): Promise<{
  data: {
    data: {
      memberContributions: number
      payout: number
    }
  }
}> => {
  return await axiosServices.get(
    `/v1/accounting/bf-computation/fund/${fundId}/members/${userId}/proportional-payout`
  )
}

export const getBeneficiaryFundStats = async (
  fundId: string
): Promise<BeneficiaryFundStatsResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-dashboard/fund/${fundId}/beneficiary-stats`
  )
}


export interface MemberAccountingStats {
  success: boolean;
  data: {
    totalContributions: number;
    totalPayout: number;
    totalContributors: number;
  };
}

export interface MemberStatsData {
  totalBeneficiaries: number;
  totalUserContributionsAmount: number;
  wallet: {
    id: string;
    fundId: string;
    uuid: string;
    balance: number;
    updatedAt: string;
    createdAt: string;
  };
  totalCases: number;
  totalLivesCovered: number;
  accountingSats: MemberAccountingStats;
}

export interface MemberStatsApiResponse {
  data: {
    success: boolean;
    message: string;
    data: MemberStatsData;
  };
}


export const getMemberStats = async (
  fundId: string
): Promise<MemberStatsApiResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-dashboard/fund/${fundId}/member-stats`
  );
};

export const getPrincipalMembership = async (
  fundId: string
): Promise<PrincipalMembershipResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-dashboard/fund/${fundId}/principal-membership`
  )
}


export const getBeneficialPrincipals = async (
  fundId: string
): Promise<BeneficiaryPrincipalsResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-dashboard/fund/${fundId}/beneficiary-principals`
  )
}



export const getPrincipalBfComputation = async (
  fundId: string
): Promise<{

  data: {
    success: true
    data: {
      fund: {
        fundId: string
        totalLivesCoveredCount: number
        maxPayoutCap: number
        proportionalPayout: {
          memberPayout: number
          benefitsPayable: number
        }
      }
    }
  }
}> => {
  return await axiosServices.get(
    `/v1/accounting/bf-computation/fund/${fundId}/principal-view`
  )
}


// ... rest of the existing code ...
