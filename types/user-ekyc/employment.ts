export type EmploymentInfoType = {
  occupation: string
  jobTitle: string
  employerName: string
  currentWorkAddress: string
  currentSalary: string
  sideHustleIncome?: string
  employmentStatus: string
}

export type CreateEmploymentInfoType = {
  occupation: string
  jobTitle: string
  employerName: string
  currentWorkAddress: string
  currentSalary: string
  sideHustleIncome?: string
  employmentStatus: string
}

export type UpdateEmploymentInfoType = {
  userId?: string
  occupation?: string
  jobTitle?: string
  employerName?: string
  currentWorkAddress?: string
  currentSalary?: string
  sideHustleIncome?: string
  employmentStatus?: string
}
