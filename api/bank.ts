import axiosServices from "@/utils/axios"




export const getBanks = async (params: {
    [key: string]: any
}): Promise<{
    data: {
        data: {
            id: number;
            code: string;
            name: string;
        }[]
    }
}> => {
    return await axiosServices.get(`/v1/payments/get-banks`, { params })
}


export const retrieveAccountDetails = async (data: {
    accountNumber: string, bankCode: string
}): Promise<{
    data: { data: { account_name: string, code: string } }
}> => {
    return await axiosServices.post(`/v1/payments/retrieve-account`, { ...data })
}
