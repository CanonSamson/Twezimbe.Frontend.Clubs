import { RequestType } from '@/types/request'
import axiosServices from '@/utils/axios'


export type ReceiverRequestResponse = {
    data: {
        requests: RequestType[]
        pagination: any
    }
}

export const getReceiverRequest = async (params: {
    [key: string]: any
}): Promise<ReceiverRequestResponse> => {
    return await axiosServices.get(`/v1/tenancy/request/receiver`, { params })
}


export type ReceiverRequestCountResponse = {
    data: {
        count: number
    }
}


export const getReceiverRequestCount = async (params: {
    [key: string]: any
}): Promise<ReceiverRequestCountResponse> => {
    return await axiosServices.get(`/v1/tenancy/request/receiver/count`, { params })
}


