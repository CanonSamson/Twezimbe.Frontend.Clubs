import { FileCaseAsBeneficiaryBodyDataType, FileCaseBodyDataType } from '@/types/bf/file-case'
import axiosServices from '@/utils/axios'

interface Pagination {
  totalMembers: number
  totalPages: number
  currentPage: number
  pageSize: number
}

interface Beneficiary {
  lastName: string
  firstName: string
  fundId: string
  userId: string
  updatedAt: string
  createdAt: string
  relationship: string
  dateOfBirth: string
  beneficiary: null | any
}

export interface BfCase {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  fundId: string
  updatedAt: string
  caseName: string
  beneficiary: Beneficiary
  reference: string | null
  contributionStatus: string
  totalContributions: number
  beneficiaryStatus: string
  benefitsPayable: number
  filedByUser?: {
        firstName: string
        lastName: string
        userId: string
        profileImage: string
        userName: string
    };
  reason: string
  totalcontributions: number
  isBenefitPaid: boolean,
  totalContributionsDisbursed: number,
}

export type BfCasesResponse = {
  data: {
    success: boolean
    message: string
    data: {
      cases: BfCase[]
      pagination: Pagination

    }
  }
}

export type FileCaseResponse = {
  data: {
    success: boolean
    message: string
    data: BfCase,
    fundId: string
    groupId: string
  }
}


export type ShareCaseUpdateResponse = {
  data: {
    success: boolean
    message: string
    data: {
      caseUpdate: {
        id: string;
        caseId: string | null;
        updatedAt: Date;
        createdAt: Date;
        message: string;
        updatedById: string | null;
      };
    },
  }
}
export type ShareCaseSupportResponse = {
  data: {
    success: boolean
    message: string
    data: {
      caseUpdate: {
        id: string;
        caseId: string | null;
        updatedAt: Date;
        createdAt: Date;
        message: string;
        updatedById: string | null;
      };
    },
  }
}


export type GetCaseSupportResponse = {
  data: {
    success: boolean
    message: string
    data: {
      caseSupport: {
        id: string;
        caseId: string | null;
        updatedAt: Date;
        createdAt: Date;
        message: string;
        updatedById: string | null;
        updatedBy: {
          lastName?: string | undefined;
          firstName?: string | undefined;
          userName?: string | null | undefined;
          profileImage?: string | null | undefined;
          id: string;
        }
      }[]
    },
  }
}

export const getBfUserCases = async (
  fundId: string,
  params?: {
    [key: string]: any
  }
): Promise<BfCasesResponse> => {
  return await axiosServices.get(`/v1/tenancy/bf-cases/${fundId}/user-cases`, {
    params
  })
}



export const fileNewCase = async (
  fundId: string,
  data: FileCaseBodyDataType
): Promise<FileCaseResponse> => {
  return await axiosServices.post(`/v1/tenancy/bf-cases/${fundId}/cases`, data)
}

export const fileNewAsBeneficiaryCase = async (
  fundId: string,
  data: FileCaseAsBeneficiaryBodyDataType
): Promise<FileCaseResponse> => {
  return await axiosServices.post(`/v1/tenancy/bf-cases/${fundId}/cases-beneficiary`, data)
}

export const approveBfCase = async (
  fundId: string,
  caseId: string
): Promise<FileCaseResponse> => {
  return await axiosServices.put(`/v1/tenancy/bf-cases/${fundId}/cases/${caseId}/approve`)
}


export const rejectBfCase = async (
  fundId: string,
  caseId: string
): Promise<FileCaseResponse> => {
  return await axiosServices.put(`/v1/tenancy/bf-cases/${fundId}/cases/${caseId}/reject`)
}




export const shareSupportBfCase = async (
  fundId: string,
  caseId: string,
  data: {
    message?: string
    inKind?: string[]
  }
): Promise<ShareCaseSupportResponse> => {
  return await axiosServices.post(`/v1/tenancy/bf-cases/${fundId}/cases/${caseId}/share-support`, data)
}


export const shareUpdateBfCase = async (
  fundId: string,
  caseId: string,
  data: {
    message: string
  }
): Promise<ShareCaseUpdateResponse> => {
  return await axiosServices.post(`/v1/tenancy/bf-cases/${fundId}/cases/${caseId}/share-update`, data)
}


export const getSupportBfCase = async (
  fundId: string,
  caseId: string,
  params: { [key: string]: any }
): Promise<GetCaseSupportResponse> => {
  return await axiosServices.get(`/v1/tenancy/bf-cases/${fundId}/cases/${caseId}/support`, { params })
}

export const createCaseDisbursement = async (
  fundId: string,
  caseId: string,
  data: {
    amount: number
    closeCaseAfterDisbursement: boolean

  }
): Promise<GetCaseSupportResponse> => {
  return await axiosServices.post(`/v1/tenancy/bf-cases/${fundId}/cases/${caseId}/disbursement`, data)
}

