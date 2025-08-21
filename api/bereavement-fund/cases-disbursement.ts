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
    beneficiary?: Beneficiary
    filedByUser?: {
        firstName: string
        lastName: string
        userId: string
        profileImage: string
        userName: string
    };
    totalDisbursement: number
    reference: string | null
    totalcontributions: string
    reason: string
}

export type BfCasesResponse = {
    data: {
        success: boolean
        message: string
        data: {
            disbursements: {
                status: string
                createdAt: string
                case: BfCase
            }[]
            pagination: Pagination

        }
    }
}

export const getBfCaseDisbursement = async (
    fundId: string,
    params?: {
        [key: string]: any
    }
): Promise<BfCasesResponse> => {
    return await axiosServices.get(`/v1/tenancy/bf-cases/${fundId}/bf-cases-disbursement`, {
        params
    })
}

export const declineBfCaseDisbursement = async (
    data?: {
        disbursementId: string
    }
): Promise<{
    message: string,
    data: {

        success: true,
        message: string,
        data: any
    }
}> => {
    return await axiosServices.patch(`/v1/tenancy/bf-cases/disbursements/decline`, data)
}


export const bfCaseFundDisbursement = async (
    data?: {
        disbursementId: string
    }
): Promise<{
    data: {
        success: true,
        message: string,
        data: any
    }
}> => {
    return await axiosServices.post(`/v1/accounting/bf-fund-wallet/case-disbursement`, data)
}


