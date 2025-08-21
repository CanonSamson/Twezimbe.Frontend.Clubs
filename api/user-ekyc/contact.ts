import {
  CreateContactInfoType,
  ContactInfoType,
  UpdateContactInfoType
} from '@/types/user-ekyc/contact'
import axiosServices from '@/utils/axios'

export type ContactInfoResponse = {
  data: {
    data: ContactInfoType
  }
}

export type UpdateContactInfoResponse = {
  data: {
    completed: boolean
    success: boolean
    data: ContactInfoType
  }
}

export type CreateContactInfoResponse = {
  data: {
    completed: boolean
    success: boolean
    data: ContactInfoType
  }
}

export const getContactInfo = async (): Promise<ContactInfoResponse> => {
  return await axiosServices.get('/v1/ekyc/get/user/contact')
}

export const updateContactInfo = async (
  data: UpdateContactInfoType
): Promise<UpdateContactInfoResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/contact', data)
}

export const createContactInfo = async (
  data: CreateContactInfoType
): Promise<CreateContactInfoResponse> => {
  return await axiosServices.post('/v1/ekyc/post/user/contact', data)
}
