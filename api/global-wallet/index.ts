import { GlobalWalletType } from '@/types/global-wallet'
import axiosServices from '@/utils/axios'

export const activateGlobalWallet = async ({
  currency
}: {
  currency: string
}): Promise<{
  data: {
    success: boolean
    data: {
      id: string
      userId: string
      uuid: string
      balance: number
      updatedAt: Date
      createdAt: Date
      accountCode: string | null
      active: boolean
    }
  }
}> => {
  return await axiosServices.patch(
    '/v1/accounting/global-wallet/wallet/activate',
    { currency }
  )
}

export const getGlobalWallet = async (): Promise<{
   data: {
     wallet: GlobalWalletType | null
    isCreated: boolean
   }
}> => {
  return await axiosServices.get('/v1/accounting/global-wallet/wallet')
}

export const getGlobalWalletBfSubWallets = async (): Promise<{
  data: {
    data: GlobalWalletType[]
  }
}> => {
  return await axiosServices.get('/v1/accounting/global-wallet/bf-sub-wallets')
}

export const getGlobalWalletTransactions = async (): Promise<{
  data: any
}> => {
  return await axiosServices.get('/v1/accounting/global-wallet/transactions')
}


export const getGlobalWalletAccounts = async (): Promise<{
  data: any
}> => {
  return await axiosServices.get('/v1/accounting/global-wallet/accounts')
}

