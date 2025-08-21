"use client";
import React from "react";
import MembersChannelChatView from "@/sections/chatview/memberschatview/membersChannelChatView";
import MembersGroupChatView from "@/sections/chatview/memberschatview/membersGroupChatView";
import { useSettingModal } from "@/contexts/modal-setting";
import { useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";

const Member = () => {
  const { modalData } = useSettingModal();

  const group = useAppSelector((state) => state.group?.group);

  const channelId  = useParams()?.channelId as string;

  const channel = group?.channels.find((item) => item.id === channelId);

  const isGroupSettings =
    modalData?.groupDetailsModal?.isGroupSettings ||
    (channel?.name === "general" && channel?.privacy === "PUBLIC") ||
    channel?.privacy === "PUBLIC";

  if (isGroupSettings) return <MembersGroupChatView group={group} />;
  else return <MembersChannelChatView channel={channel} group={group} />;
};

export default Member;
