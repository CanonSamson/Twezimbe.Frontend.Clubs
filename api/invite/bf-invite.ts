import axiosServices from "@/utils/axios"

interface BereavementFundInviteResponse {
    message: string
    inviteId: string
}

interface BereavementFundInviteAcceptResponse {
    message: string
    invite: {
        id: string;
        fundId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        groupId: string | null;
        senderId: string;
        channelId: string | null;
        receiverId: string | null;
    }
}

interface BereavementFundInviteDeclineResponse {
    message: string
    invite: {
        id: string;
        fundId: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        groupId: string | null;
        senderId: string;
        channelId: string | null;
        receiverId: string | null;
    }
}


export const sendBereavementFundInvite = async (
    fundId: string,
    groupId: string,
    data: { receiverId: string }
): Promise<BereavementFundInviteResponse> => {
    return await axiosServices.post(`/v1/tenancy/invite/bf/${fundId}/${groupId}/send`, data)
}

export const acceptBereavementFundInvite = async (
    inviteId: string
): Promise<BereavementFundInviteAcceptResponse> => {
    return await axiosServices.patch(`/v1/tenancy/invite/bf/${inviteId}/accept`)
}

export const declineBereavementFundInvite = async (
    inviteId: string
): Promise<BereavementFundInviteDeclineResponse> => {
    return await axiosServices.patch(`/v1/tenancy/invite/bf/${inviteId}/decline`)
}