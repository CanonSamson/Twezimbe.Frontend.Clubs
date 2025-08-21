import axiosServices from '@/utils/axios'

export const processBfWalletWithdrawal = async (data: {
  amount: number
  accountNumber: string
  accountName: string
  bankCode: string
  password: string
  fundId: string
  paymentProvider: 'mtn-ug' | 'airtel-ug' | 'flutterwave'
}): Promise<{
  success: string
  message: string
}> => {
  return await axiosServices.post(
    `/v1/payments/bf-wallet/fund/withdrawal`,
    data
  )
}
