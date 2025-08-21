import { ChannelType, GroupType } from "@/types/groups";
import GroupSettings from "./group";
import ChannelSettings from "./channel";
import { useSettingModal } from "@/contexts/modal-setting";

interface SettingsProps {
  group: GroupType | undefined | any;
  channel: ChannelType | undefined;
  isFirstGeneralPublicChannel: boolean;
}

export const Settings = ({
  group,
  channel,
  isFirstGeneralPublicChannel,
}: SettingsProps) => {
  const { modalData } = useSettingModal();

  const isGroupSettings =
    modalData?.groupDetailsModal?.isGroupSettings ||
    isFirstGeneralPublicChannel;

  if (isGroupSettings) return <GroupSettings group={group} channel={channel} />;
  else return <ChannelSettings group={group} channel={channel} />;
};

export default Settings;
