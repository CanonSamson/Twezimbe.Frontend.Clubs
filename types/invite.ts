export type InviteType = {
    id: string;
    groupId: string;
    fundId: string | null;
    senderId: string;
    channelId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "DECLINED"; // assuming possible statuses
    receiverId: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    bereavementFund?: {
        name: string,
        groupId: string,
        id: string
    }
    sender: {
        id: string;
        profile: {
            firstName: string;
            lastName: string;
            profileImage: string;
            userName: string;
        };
    };
    group: {
        id: string;
        name: string;
        iconImage: string;
    };
    channel: {
        id: string;
        name: string;
    };
    type: string
};
