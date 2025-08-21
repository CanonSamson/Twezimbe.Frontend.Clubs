import { FundRulesType } from '@/types/bf/fund'
import axiosServices from '@/utils/axios'

export type BfFundRuleResponse = {
  data: {
    message: string

    success: boolean
    fundRule: FundRulesType & { baseCurrency?: string }
  }
}

export const getBfFundRuleAsMember = async (
  fundId: string
): Promise<BfFundRuleResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-fund/${fundId}/fund-rule-member`
  )
}

export const getBfFundRule = async (
  fundId: string
): Promise<BfFundRuleResponse> => {
  return await axiosServices.get(`/v1/tenancy/bf/fund/${fundId}/fund-rule`)
}

interface RequestPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface BfRequest {
  id: string
  message: string
  fundId: string
  createdAt: string
  userId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  updatedAt: string
  user: {
    isKyc: boolean
    profile: {
      firstName: string
      lastName: string
      profileImage: string
      userName: string
    }
  }
}

export type BfRequestsResponse = {
  data: {
    success: boolean
    message: string
    data: BfRequest[]
    pagination: RequestPagination
  }
}

export type SendBfRequestResponse = {
  data: {
    success: boolean
    request: BfRequest,
    isKyc?: boolean
    message?: string
  }
}

export const sendBfRequest = async (
  data: any,
  fundId: string
): Promise<SendBfRequestResponse> => {
  return await axiosServices.post(`/v1/tenancy/bf/fund/${fundId}/request`, data)
}

export const getBfRequests = async (
  fundId: string,
  params?: {
    [key: string]: any
  }
): Promise<BfRequestsResponse> => {
  return await axiosServices.get(`/v1/tenancy/bf-fund/${fundId}/requests`, {
    params
  })
}


interface User {
  id: string
  isKyc: boolean
  firstName: string
  lastName: string
  profileImage: string
  userName: string
}

interface Role {
  permission: 'USER' | 'OWNER'| "ADMIN" | "PRINCIPAL"| "SUPERVISOR" |  "TREASURER"
}

interface Member {
  userId: string
  groupId: string
  user: User
  roles: Role[]
}

interface Pagination {
  totalMembers: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export type NoneMembersResponse = {
  data: {
    success: boolean
    members: Member[]
    pagination: Pagination
  }
}

export const getNoneBfGroupMembers = async (
  fundId: string,
  groupId: string
): Promise<NoneMembersResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-fund/${fundId}/group/${groupId}/none-members`
  )
}

interface BfMember {
  id: string
  user: User
  roles: Role[]
}

export type BfMembersResponse = {
  data: {
    success: boolean
    message: string
    members: BfMember[]
    pagination: Pagination
  }
}

export const getBfMembers = async (
  fundId: string,
  params?: {
    [key: string]: any
  }
): Promise<BfMembersResponse> => {
  return await axiosServices.get(`/v1/tenancy/bf-fund/${fundId}/members`, {
    params
  })
}

export type PaymentMethodsResponse = {
  data: {
    message: string
    success: boolean
    paymentMethods: Array<{
      id: string
      fundId: string
      bankName: string | null
      accountNumber: string | null
      accountName: string | null
      userId: string
      mobileMoneyNumber: string | null
      mobileMoneyName: string | null
      accountType: string
      updatedAt: string
      createdAt: string
    }>
  }
}

export const getMemberPaymentMethod = async (
  fundId: string
): Promise<PaymentMethodsResponse> => {
  return await axiosServices.get(
    `/v1/tenancy/bf/fund/${fundId}/payment-methods`
  )
}

export const updateMemberPaymentMethod = async (
  fundId: string,
  data: any
): Promise<PaymentMethodsResponse> => {
  return await axiosServices.put(
    `/v1/tenancy/bf/fund/${fundId}/payment-methods`,
    { paymentMethods: data })
}

export const updateBfFundRule = async (
  fundId: string,
  data: any
): Promise<BfFundRuleResponse> => {
  return await axiosServices.put(`/v1/tenancy/bf/fund/${fundId}/rules`, data)
}

export type BfRequestActionResponse = {
  data: {
    success: boolean
    message: string
    request: BfRequest
  }
}

export const approveBfRequest = async (
  fundId: string,
  requestId: string
): Promise<BfRequestActionResponse> => {
  return await axiosServices.put(
    `/v1/tenancy/bf/fund/${fundId}/requests/${requestId}/approve`
  )
}

export const declineBfRequest = async (
  fundId: string,
  requestId: string
): Promise<BfRequestActionResponse> => {
  return await axiosServices.put(
    `/v1/tenancy/bf/fund/${fundId}/requests/${requestId}/decline`
  )
}
