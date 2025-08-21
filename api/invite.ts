import { InviteType } from '@/types/invite'
import axiosServices from '@/utils/axios'


export type ReceiverInviteResponse = {
    data: {
        invites: InviteType[]
        pagination: any
    }
}

export const getReceiverInvite = async (params: {
    [key: string]: any
}): Promise<ReceiverInviteResponse> => {
    return await axiosServices.get(`/v1/tenancy/invite/receiver`, { params })
}



export type ReceiverInviteCountResponse = {
    data: {
        count: number
    }
}

export const getReceiverInviteCount = async (params: {
    [key: string]: any
}): Promise<ReceiverInviteCountResponse> => {
    return await axiosServices.get(`/v1/tenancy/invite/receiver/count`, { params })
}


