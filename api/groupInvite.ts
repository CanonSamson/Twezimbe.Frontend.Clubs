import axiosServices from "@/utils/axios";
import { JoinGroupResponse } from "./group";

export type GroupInvitationLinkResponse = {
  data: {
    success: boolean;
    linkId: string;
    link: string;
    access: boolean;
  };
};

export type GroupLinkDataResponseData = {
    success: boolean;
    group: {
      id: string;
      name: string;
      iconImage: string;
      description: string;
      coverImage: string;
    };
    groupId: string;
    adminId: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
    };
};
export type GroupLinkDataResponse = {
  data: GroupLinkDataResponseData
};
export const getGroupInviteLink = async (
  groupId: string,
  params?: {
    permission: "ADMIN" | "USER";
  }
): Promise<GroupInvitationLinkResponse> => {
  return await axiosServices.get(`/v1/tenancy/invite/${groupId}/invites/link`, {
    params,
  });
};

export const getGroupByInviteLink = async (
  linkId: string
): Promise<GroupLinkDataResponse> => {
  return await axiosServices.get(`/v1/tenancy/invite/group/${linkId}`);
};

export const joinGroupByInviteLink = async (
  linkId: string
): Promise<JoinGroupResponse> => {
  return await axiosServices.post(`/v1/tenancy/invite/group/join/${linkId}`);
};
