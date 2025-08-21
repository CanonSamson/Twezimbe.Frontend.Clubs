"use client";
import SettingsGroupChatView from "@/sections/chatview/settingschatview/settingsGroupChatView";
import SettingsChannelChatView from "@/sections/chatview/settingschatview/settingsChannelChatView";
import React from "react";
import { useSettingModal } from "@/contexts/modal-setting";
import { useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";

const Page = () => {
  const { modalData } = useSettingModal();

  const group = useAppSelector((state) => state.group?.group);

  const { channelId } = useParams();

  const channel = useAppSelector((state) =>
    state.group?.group?.channels.find((item) => item.id === channelId)
  );
  const isGroupSettings =
    modalData?.groupDetailsModal?.isGroupSettings ||
    (channel?.name === "general" && channel?.privacy === "PUBLIC") ||
    channel?.privacy === "PUBLIC";

  if (isGroupSettings)
    return <SettingsGroupChatView group={group} channel={channel} />;
  else return <SettingsChannelChatView channel={channel} group={group} />;
};

export default Page;
