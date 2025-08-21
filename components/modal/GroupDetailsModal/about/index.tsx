import { ChannelType, GroupType } from "@/types/groups";
import { GroupAbout } from "./group";
import ChannelAbout from "./channel";
import { useSettingModal } from "@/contexts/modal-setting";

interface SettingsProps {
  group: GroupType | undefined | any;
  channel: ChannelType | undefined;
  isFirstGeneralPublicChannel: boolean;
}

export const About = ({
  group,
  channel,
  isFirstGeneralPublicChannel,
}: SettingsProps) => {
  const { modalData } = useSettingModal();
  const isGroupSettings =
    modalData?.groupDetailsModal?.isGroupSettings ||
    isFirstGeneralPublicChannel;

  if (isGroupSettings) return <GroupAbout group={group} />;
  else return <ChannelAbout group={group} channel={channel} />;
};

export default About;
