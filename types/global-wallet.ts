export type GlobalWalletType = {
  id: string
  userId: string
  uuid: string
  createdAt?: Date
  updatedAt?: Date
  balance: number
  accountCode?: string | null
  active?: boolean
  fundId?: string
  fund?: any | null
}
