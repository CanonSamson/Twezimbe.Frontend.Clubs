import { NextOfKinType } from '@/types/kyc'
import axiosServices from '@/utils/axios'

export type ForgotPasswordDTO = {
  email: string
}
export type ResetPasswordDTO = {
  token: string
  newPassword: string
}

export type PasswordLessDTO = {
  system: string
  email: string
}

export type ForgotPasswordResponse = {
  data: {
    success: boolean
    token: string
    message: string
  }
}

export const forgotPassword = async (
  data: ForgotPasswordDTO
): Promise<ForgotPasswordResponse> => {
  return await axiosServices.post('/v1/ekyc/basic/password/forgot', data)
}

export const resetPassword = async (
  data: ResetPasswordDTO
): Promise<ForgotPasswordResponse> => {
  return await axiosServices.post('/v1/ekyc/basic/password/reset', data)
}

export type BasicUserInfoResponse = {
  data: {
    firstName: string
    email: string
    userName: string | null
    lastName: string
    gender: string | null
    maritalStatus: string | null
    otherNames: string | null
    dateOfBirth: Date | null
    mobileNumber: string | null
    optionalNumber: string | null
  } | null
}

export const getBasicUserInfo = async (): Promise<BasicUserInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/basic-info')
}

export type NextOfKinInfoResponse = {
  data: {
    data: NextOfKinType | null
  }
}
export type NextOfKinInfoCreateResponse = {
  data: {
    success: boolean
    completed: boolean
    data: {
      gender: string | null
      fullName: string | null
      phone1: string | null
      phone2: string | null
      email1: string | null
      email2: string | null
      address: string | null
      relationship: string | null
    } | null
  }
}

export type CreateNextOfKinType = {
  fullName: string
  phone1: string
  phone2: string
  email1: string
  email2: string
  address: string
  gender: string
  relationship: string
}
export type UpdateNextOfKinType = {
  fullName?: string
  phone1?: string
  phone2?: string
  email1?: string
  email2?: string
  address?: string
  gender?: string
  relationship?: string
}

export const getNextOfKinInfo = async (): Promise<NextOfKinInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/next-of-kin')
}

export const createNextOfKinInfo = async (
  data: CreateNextOfKinType
): Promise<NextOfKinInfoCreateResponse> => {
  return await axiosServices.post('/v1/ekyc/post/user/next-of-kin', data)
}
export const updateNextOfKinInfo = async (
  data: UpdateNextOfKinType
): Promise<NextOfKinInfoCreateResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/next-of-kin', data)
}

export type EmploymentInfoResponse = {
  data: {
    institution: string | null
    yearAttended: string | null
    certifications: string | null
    highestQualification: string | null
  } | null
}

export const getEmploymentInfo = async (): Promise<EmploymentInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/employment')
}

export type EducationInfoResponse = {
  data: {
    occupation: string | null
    jobTitle: string | null
    employerName: string | null
    currentWorkAddress: string | null
    currentSalary: string | null
    sideHustleIncome: string | null
    employmentStatus: string | null
    highestEducationLevel: string | null
  } | null
}

export const getEducationInfo = async (): Promise<EducationInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/education')
}
