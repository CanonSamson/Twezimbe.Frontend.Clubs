import axiosServices from '@/utils/axios'

export const getBfRolesOptions = async (
  fundId: string
): Promise<{
  data: {
    success: boolean
    roles: string[]
  }
}> => {
  return await axiosServices.get(`/v1/tenancy/bf-fund/${fundId}/role-options`)
}
export const getBfRolesOptionsWithCustomRoles = async (
  fundId: string
): Promise<{
  data: {
    success: boolean
    roles: {
      id: string
      name: string
      permission: string
      isCustom: boolean
    }[]
  }
}> => {
  return await axiosServices.get(`/v1/tenancy/bf-fund/${fundId}/role-options`, {
    params: {
      withCustom: 'true'
    }
  })
}

export const addBfRolesOptions = async (
  fundId: string,
  data: {
    firstName: string
    lastName: string
    relationship: string
    phoneNumber: string
    email?: string
    dateOfBirth: string
  }
): Promise<{
  data: {
    success: boolean
    message: string

    updatedFund: {
      id: string
      name: string
      fundDetails: string
      type: string
      createdById: string
      userId: string | null
      suspended: boolean
      baseCurrency: string | null
      groupId: string | null
      createdAt: Date
      rolesOptions: string[]
      updatedAt: Date
      fundWalletId: string | null
    }
  }
}> => {
  return await axiosServices.post(`/v1/tenancy/bf/fund/${fundId}/roles`, data)
}

export const assignRole = async (
  fundId: string,
  data: {
    role: string
    userId: string
  }
): Promise<{
  success: boolean
  message: string
  error?: string

  role: {
    fundId: string
    id: string
    userId: string
    suspended: boolean
    createdAt: Date
    updatedAt: Date
    permission: string
    bfMemberId: string
    active: boolean
  }
}> => {
  return await axiosServices.put(
    `/v1/tenancy/bf-role/fund/${fundId}/assign-role`,
    data
  )
}

export const removeRole = async (
  fundId: string,
  data: {
    role: string
    userId: string
  }
): Promise<{
  success: boolean
  message: string
  error?: string

  role: {
    fundId: string
    id: string
    userId: string
    suspended: boolean
    createdAt: Date
    updatedAt: Date
    permission: string
    bfMemberId: string
    active: boolean
  }
}> => {
  return await axiosServices.delete(
    `/v1/tenancy/bf-role/fund/${fundId}/remove-role`,
    { data }
  )
}

export const createCustomBfRole = async (
  fundId: string,
  data: {
    permission: string
    name: string
  }
): Promise<{
  success: boolean
  message: string
  error?: string
  customRole: {
    id: string
    permissions: string[]
    fundId: string
    createBy: string
    name: string
    active: boolean
  }
}> => {
  return await axiosServices.post(
    `/v1/tenancy/bf-role/fund/${fundId}/custom-roles`,
    data
  )
}

export const assignCustomBfRoleToUser = async (
  fundId: string,
  data: {
    customBfRoleOptionId: string
    userId: string
  }
): Promise<{
  success: boolean
  message: string
  error?: string
  customRole: {
    id: string
    permissions: string[]
    fundId: string
    createBy: string
    name: string
    active: boolean
  }
}> => {
  return await axiosServices.post(
    `/v1/tenancy/bf-role/fund/${fundId}/assign-custom-role`,
    data
  )
}
