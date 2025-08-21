export type FileCaseBodyDataType = {
  beneficiaryId: string
  description: string
  caseName: string
  reason: string
  targetAmount: number
  timeLine: string
  coverImage: string | null
}

export type FileCaseAsBeneficiaryBodyDataType = {
  principalId: string
  description: string
  caseName: string
  reason: string
  targetAmount: number
  timeLine: string
  coverImage: string | null
}
