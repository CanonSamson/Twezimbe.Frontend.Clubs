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

export type BfWallet = {
  id: string
  fundId: string
  userId: string
  uuid: string
  balance: number
  updatedAt: string
  createdAt: string
}

export type BfWalletResponse = {
  data: {
    success: boolean
    data: BfWallet
  }
}

export type BfWalletsResponse = {
  data: {
    success: boolean
    wallets: BfWallet[]
  }
}

export const getBfWallets = async (
  fundId: string
): Promise<BfWalletsResponse> => {
  return await axiosServices.get(`/v1/tenancy/bf/fund/${fundId}/wallets`)
}
export const getBfWallet = async (
  fundId: string
): Promise<BfWalletResponse> => {
  return await axiosServices.get(
    `/v1/accounting/bf-wallet/fund/${fundId}/wallet`
  )
}

export type BfWalletTransaction = {
  id: string
  fundId: string
  userId: string
  amount: number
  type: string
  status: string
  reference: string | null
  description: string | null
  paymentType: string
  walletId: string
  transactionType: "DEBIT" | "CREDIT"
  metadata: {
    currency: string
    paymentType: string
    transactionId: string
    expectedAmount: number
    receivedAmount: number
    paymentProvider: string
  } | null
  createdAt: string
  updatedAt: string
}

export type CreateWalletResponse = {
  data: {
    success: boolean
    wallet: BfWallet
  }
}

export const createWallet = async (
  fundId: string,
  data: { amount: number }
): Promise<CreateWalletResponse> => {
  return await axiosServices.post(`/v1/tenancy/bf/fund/${fundId}/wallets`, data)
}

export type BfWalletTransactionsResponse = {
  data: {
    success: boolean
    transactions: BfWalletTransaction[]
  }
}

export const getBfWalletTransactions = async (
  fundId: string
): Promise<BfWalletTransactionsResponse> => {
  return await axiosServices.get(
    `/v1/accounting/bf-wallet/fund/${fundId}/user-transactions`
  )
}

export const getFundTransactions = async (
  fundId: string
): Promise<BfWalletTransactionsResponse> => {
  return await axiosServices.get(
    `/v1/accounting/bf-fund-wallet/fund/${fundId}/transactions`
  )
}

export type BfMembershipPaymentResponse = {
  data: {
    success: boolean
    message: string
    payment: {
      id: string
      amount: number
      status: string
      paymentUrl: string
      reference: string
    }
  }
}

export const payBfMembership = async (
  fundId: string,
  data: {
    subscriptionId: string
    test: string
  }
): Promise<BfMembershipPaymentResponse> => {
  return await axiosServices.post(
    `/v1/payments/bf-wallet/${fundId}/payments/membership`,
    data
  )
}

export const payBfMonthlyMembership = async (
  fundId: string,
  data: {
    subscriptionId: string
  }
): Promise<BfMembershipPaymentResponse> => {
  return await axiosServices.post(
    `/v1/payments/bf-wallet/${fundId}/payments/monthly-membership`,
    data
  )
}

export const payBfSubscriptions = async (
  fundId: string,
 data: {
    amount: number
    method?: string
  }
): Promise<BfMembershipPaymentResponse> => {
  return await axiosServices.post(
    `/v1/payments/bf-subscription/${fundId}/payments/beneficiary-fees`,data
  )
}
export const contributeToCaseWithBfWallet = async (
  caseId: string,
  data: {
    amount: string
    fundId: string
  }
): Promise<BfMembershipPaymentResponse> => {
  return await axiosServices.post(
    `/v1/payments/bf-wallet/case/${caseId}/contributions`,
    data
  )
}
