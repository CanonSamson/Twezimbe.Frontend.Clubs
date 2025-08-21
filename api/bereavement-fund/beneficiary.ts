import axiosServices from '@/utils/axios'
import { NoneMembersResponse } from './fund'

interface Pagination {
  totalMembers: number
  totalPages: number
  currentPage: number
  pageSize: number
}

// Add new interfaces for beneficiaries
interface Beneficiary {
  id: string
  fundId: string
  userId: string
  beneficiaryId: string | null
  relationship: string
  userName: string | null 
  lastName: string
  firstName: string
  phoneNumber: string
  dateOfBirth: string
  profileImage: string | null
}

export type BeneficiaryResponse = {
  data: {
    success: boolean
    message: string
    beneficiary: Beneficiary
    askForKyc?: boolean
  }
}

export type BeneficiariesResponse = {
  data: {
    success: boolean
    message: string
    beneficiaries: Beneficiary[]
    pagination: Pagination
  }
}

// Add new functions for beneficiary management
export const addUserBeneficiary = async (
  fundId: string,
  data: {
    beneficiaryId: string
    relationship: string
  }
): Promise<BeneficiaryResponse> => {
  return await axiosServices.post(
    `/v1/tenancy/bf-beneficiary/fund/${fundId}/beneficiaries/user`,
    data
  )
}

export const addManualBeneficiary = async (
  fundId: string,
  data: {
    firstName: string
    lastName: string
    relationship: string
    phoneNumber: string
    email?: string
    dateOfBirth: string
  }
): Promise<BeneficiaryResponse> => {
  return await axiosServices.post(
    `/v1/tenancy/bf/fund/${fundId}/beneficiaries/manual`,
    data
  )
}

export const getFundBeneficiaries = async (
  fundId: string,
  params?: {
    [key: string]: any
  }
): Promise<BeneficiariesResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf/fund/${fundId}/beneficiaries`,
    {
      params
    }
  )
}

export type PotentialUserBeneficiariesResponse = {
  data: {
    success: boolean
    message: string
    beneficiaries: Beneficiary[]
    pagination: Pagination
  }
}

export const getPotentialUserBeneficiaries = async (
  fundId: string,
  groupId: string,
  params?: {
    [key: string]: any
  }
): Promise<NoneMembersResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-beneficiary/fund/${fundId}/group/${groupId}/potential-beneficiaries`,
    {
      params
    }
  )
}
interface BeneficiarySubscriptionFee {
  id: string
  status: string
  name: string
  paidAmount: number
  nextPaymentDate: string | null
  amount: number
  year: number
  paymentDate: string | null
  createdAt: string
  beneficiaryId: string
  updatedAt: string
  beneficiary: Beneficiary
}

interface BeneficiarySubscriptionFeesResponse {
  data: {
    success: boolean
    message: string
    beneficiaries: BeneficiarySubscriptionFee[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export type BeneficiarySubscriptionFeeCalculationType = {
  categories: {
    category: string
    count: number
    riskProfile: number
    amount: number
    remark: string
  }[]
  subtotal: number
  total: number
  grandTotal: number
  annualBaseFee: number
}


interface BeneficiarySubscriptionCalculationResponse {
  data: {
    success: boolean
    calculation: {
      categories: {
        category: string
        count: number
        riskProfile: number
        amount: number
        remark: string
      }[]
      subtotal: number
      total: number
      grandTotal: number
      annualBaseFee: number
      membershipFee: number

    }
  }
}



interface BeneficiaryMetaAges {
  adult: { from: number; to: number };
  youth: { from: number; to: number };
  preSeniors: { from: number; to: number };
  seniors: { from: number; to: number | string };
  youngChildren: { from: number; to: number };
}

interface BeneficiaryMeta {
  age: number;
  ages: BeneficiaryMetaAges;
  annualBasedFee: number;
  dateOfBirth: string;
  subscription: {
    adult: number;
    youth: number;
    seniors: number;
    preSeniors: number;
    youngChildren: number;
  };
  subscriptionFee: number;
}

interface BeneficiarySubscription {
  amount: number;
  beneficiaryId: string;
  createdAt: string;
  id: string;
  meta: BeneficiaryMeta;
  name: string;
  nextPaymentDate: string | null;
  paidAmount: number;
  paymentDate: string | null;
  paymentRef: string | null;
  status: string;
  updatedAt: string;
  total: number;
}

export interface SubscriptionBeneficiary {
  id: string;
  fundId?: string;
  userId?: string;
  updatedAt: string;
  createdAt: string;
  beneficiaryId?: string | null;
  relationship: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  beneficiary?: any | null;
  age: number;
  ageInText?: string;
  riskProfile?: number;
  subscription?: BeneficiarySubscription;
}

interface BeneficiarySubscriptionsResponse {
  data: {
    success: boolean
    total: number
    totalPaid: number
    beneficiaries: SubscriptionBeneficiary[];
  }
}


interface BeneficiaryRiskProfileCalculationResponse {
  data: {
    success: boolean
    data: {
      subscriptionFee: number;
      age: number | null;
      ageRang: {
        from: number;
        to: number;
      } | {
        from: number;
        to: string;
      } | null;
      riskProfile: number;
      ageCategory: string
    },
    user: {
      firstName: string | undefined;
      lastName: string | undefined;
      profileImage: string | null | undefined;
    }
  }
}

export const getBeneficiariesSubsriptionfees = async (
  fundId: string,
  params?: {
    [key: string]: any
  }
): Promise<BeneficiarySubscriptionFeesResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-beneficiary/fund/${fundId}/beneficiaries/subscription-fees`,
    {
      params
    }
  )
}


export const getUserSubscriptionFeeCalculation = async (
  fundId: string,

): Promise<BeneficiarySubscriptionCalculationResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-beneficiary/fund/${fundId}/subscription/calculation`,

  )
}

export const getUserBeneficiarySubscriptionFeeCalculation = async (
  fundId: string,

): Promise<BeneficiarySubscriptionsResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-beneficiary/fund/${fundId}/beneficiary-subscription/calculation`,

  )
}

export const getUserPendingSubscriptionFeeCalculation = async (
  fundId: string,

): Promise<BeneficiarySubscriptionCalculationResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-beneficiary/fund/${fundId}/pending-subscription/calculation`,

  )
}

export const calculateBeneficiaryRiskProfile = async (
  fundId: string,
  data: {
    beneficiaryUserId?: string
    age: number | null
  }
): Promise<BeneficiaryRiskProfileCalculationResponse> => {
  return await axiosServices.post(
    `/v1/tenancy/bf-beneficiary/fund/${fundId}/risk-profile/calculation`,
    data
  )
}

interface BeneficiaryTotalFeeResponse {
  data: {
    data: {
      totalPendingFee: number
      totalPaidFee: number
    }
  }
}

export const getUserBeneficiaryTotalPendingSubscriptionFee = async (
  fundId: string,
  params?: {
    [key: string]: any
  }
): Promise<BeneficiaryTotalFeeResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-beneficiary/fund/${fundId}/beneficiaries/total-fee`,
    {
      params
    }
  )
}
