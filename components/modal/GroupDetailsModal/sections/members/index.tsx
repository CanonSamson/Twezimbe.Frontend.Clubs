"use client";
import { ChannelType, GroupType } from "@/types/groups";
import { GroupMembers } from "./group";
import { ChannelMembers } from "./channel";
import { useSettingModal } from "@/contexts/modal-setting";

interface MembersProps {
  group: GroupType | undefined;
  channel: ChannelType | undefined;
}

export const Members = ({ group, channel }: MembersProps) => {
  const { modalData } = useSettingModal();

  const isGroupSettings =
    modalData?.groupDetailsModal?.isGroupSettings ||
    (channel?.name === "general" && channel?.privacy === "PUBLIC") ||
    channel?.privacy === "PUBLIC";

  if (isGroupSettings) return <GroupMembers group={group} />;
  else return <ChannelMembers channel={channel} group={group} />;
};
