import { MessageType } from "@/api/messaging/group";
import axiosServices from "@/utils/axios";



export const pinMessage = async (
    messageId: string,
    groupId: string,
): Promise<{
    data: {
        success: boolean
        message: string
        pinnedMessage: {
            messageId: string;
            groupId: string;
            id: string;
            userId: string;
            createdAt: Date;
        }
    }
}> => {
    return await axiosServices.post(
        `/v1/messaging/pin-messages/group/${groupId}/message/${messageId}`
    )
}

export const unpinMessage = async (
    messageId: string,
    groupId: string,
): Promise<{
    data: {
        success: boolean
        message: string
        pinnedMessage: {
            messageId: string;
            groupId: string;
            id: string;
            userId: string;
            createdAt: Date;
        }
    }
}> => {
    return await axiosServices.delete(
        `/v1/messaging/pin-messages/group/${groupId}/message/${messageId}/delete`
    )
}


export type PinnedGroupMessage = {
    id: string;
    messageId: string;
    groupId: string;
    userId: string;
    createdAt: string;
    message: MessageType | null;
}

export const getPinedMessages = async (
    groupId: string,
): Promise<{
    data: {
        success: boolean
        data: PinnedGroupMessage[]

    }
}> => {
    return await axiosServices.get(
        `/v1/messaging/pin-messages/group/${groupId}/messages`
    )
}