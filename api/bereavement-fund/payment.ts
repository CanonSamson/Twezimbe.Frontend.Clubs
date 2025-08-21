import axiosServices from '@/utils/axios'

export type BfWalletDepositionLinkResponse = {
  success: boolean
  message: string
  data: {
    data: {
      paymentLink: string
      transactionRef: string
    }
  }
}

export type PaymentInitLinkResponse = {
  success: boolean
  message: string
  data: {
    paymentLink: string
    transactionRef: string


  }
}

export const initiateBfWalletDeposit = async (
  fundId: string,
  data: {
    amount: number
    method: string
  }
): Promise<BfWalletDepositionLinkResponse> => {
  return await axiosServices.post(
    `/v1/payments/bf-wallet/${fundId}/initiate-wallet/deposit`,
    data
  )
}


export const getBfTransitionPaymentLink = async (
  fundId: string,
  data: {
    amount: number
    method: string
  }
): Promise<PaymentInitLinkResponse> => {
  return await axiosServices.post(
    `/v1/payments/bf-transition/${fundId}/initiate-wallet/deposit`,
    data
  )
}

export const getBfMembershipPaymentLink = async (
  fundId: string,
  data: {
    amount: number
    subscriptionId: string
    method: string
  }
): Promise<PaymentInitLinkResponse> => {
  return await axiosServices.post(
    `/v1/payments/bf-membership/${fundId}/payment-link/deposit`,
    data
  )
}

export const getBfSubscriptionPaymentLink = async (
  fundId: string,
  data: {
    amount: number
    method: string
  }
): Promise<PaymentInitLinkResponse> => {
  return await axiosServices.post(
    `/v1/payments/bf-subscription/${fundId}/payment-link/deposit`,
    data
  )
}

export const updateBfPaymentSettings = async (
  fundId: string,
  data: {
    installmentFrequency: string
    paymentMode: string
  }
): Promise<BfWalletDepositionLinkResponse> => {
  return await axiosServices.put(
    `/v1/tenancy/bf-fund/${fundId}/payment-settings`,
    data
  )
}
export const getBfPaymentSettings = async (
  fundId: string,

): Promise<{
  data: {
    success: string
    paymentSettings: {
      installmentFrequency: string | null
      paymentMode: string | null
    }
  }
}> => {
  return await axiosServices.get(
    `/v1/tenancy/bf-fund/${fundId}/bf-payment/settings`,
  )
}
