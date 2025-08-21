import axiosServices from '@/utils/axios'

// Types for wallet data
export type WalletBalance = {
  ugx: number
  usd: number
}

export type BankInfo = {
  name: string
  accountNumber: string
}

export type BereavementFund = {
  id: string
  name: string
  balance: number
  currency: 'ugx' | 'usd'
}

export type SavingsWallet = {
  balance: number
  currency: 'ugx'
  interestRate: number
  goalProgress: number
  goalAmount: number
}

export type CrowdfundingCampaign = {
  id: string
  name: string
  balance: number
  currency: 'ugx' | 'usd'
}

export type GlobalWalletData = {
  mainWallet: WalletBalance
  bankInfo: BankInfo
  isActivated: boolean
  bereavementFunds: BereavementFund[]
  savingsWallet: SavingsWallet
  crowdfundingCampaigns: CrowdfundingCampaign[]
  notifications: {
    count: number
  }
}

export type GlobalWalletResponse = {
  data: {
    success: boolean
    message: string
    data: GlobalWalletData
  }
}

// API function to get global wallet data
export const getGlobalWalletData = async (): Promise<GlobalWalletData> => {
  try {
    const response: GlobalWalletResponse = await axiosServices.get(
      '/v1/user/global-wallet'
    )
    return response.data.data
  } catch (error) {
    // Fallback to mock data for development
    console.warn('Using mock data for global wallet:', error)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      mainWallet: {
        ugx: 0.0,
        usd: 0.0
      },
      bankInfo: {
        name: 'Cairo Bank',
        accountNumber: '0777345667'
      },
      isActivated: false,
      bereavementFunds: [
        // {
        //   id: "bf1",
        //   name: "My First Fund",
        //   balance: 15560,
        //   currency: "ugx"
        // },
        // {
        //   id: "bf2",
        //   name: "My Second Fund",
        //   balance: 500,
        //   currency: "usd"
        // },
        // {
        //   id: "bf3",
        //   name: "Emergency Fund",
        //   balance: 25000,
        //   currency: "ugx"
        // }
      ],
      savingsWallet: {
        balance: 0,
        currency: 'ugx',
        interestRate: 0,
        goalProgress: 0,
        goalAmount: 0
      },
      crowdfundingCampaigns: [
        // {
        //   id: "cf1",
        //   name: "Help the poor",
        //   balance: 5000,
        //   currency: "ugx"
        // },
        // {
        //   id: "cf2",
        //   name: "Help the sick",
        //   balance: 7000,
        //   currency: "usd"
        // }
      ],
      notifications: {
        count: 0
      }
    }
  }
}

// API function to add money to global wallet
export const addMoneyToGlobalWallet = async (data: {
  amount: number
  currency: 'ugx' | 'usd'
  paymentMethod: string
}) => {
  return await axiosServices.post('/v1/user/global-wallet/add-money', data)
}

// API function to withdraw money from global wallet
export const withdrawFromGlobalWallet = async (data: {
  amount: number
  currency: 'ugx' | 'usd'
  withdrawalMethod: string
}) => {
  return await axiosServices.post('/v1/user/global-wallet/withdraw', data)
}

// API function to activate wallet
export const activateGlobalWallet = async ({
  currency
}: {
  currency: string
}) => {
  return await axiosServices.post('/v1/user/global-wallet/activate', {
    currency
  })
}
