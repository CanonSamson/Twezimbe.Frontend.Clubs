import { ChannelType, GroupType } from "@/types/groups";
import moment from "moment";
import { GoChevronRight } from "react-icons/go";
import useGroup from "@/hooks/userGroup";
import { IoChevronDown } from "react-icons/io5";
import CustomSlideToggle from "@/components/custom/CustomSlideToggle";
import { RiLockLine } from "react-icons/ri";
import { useSettingModal } from "@/contexts/modal-setting";
import { updateChannelDetails } from "@/api/channel";
import { useMutation } from "@tanstack/react-query";

interface SettingsProps {
  group: GroupType | undefined | any;
  channel: ChannelType | undefined;
}

export const ChannelSettings = ({ group, channel }: SettingsProps) => {
  const { isChannelAdmin, canDeleteGroup } = useGroup();
  const { toggleModal, modalData } = useSettingModal();

  const { mutate: handleUpdatePrivacy, isPending } = useMutation({
    mutationKey: ["toggle-channel-privacy", channel?.id as string],
    mutationFn: () =>
      updateChannelDetails(channel?.id as string, {
        groupId: group.id,
        privacy: channel?.privacy === "PRIVATE" ? "PUBLIC" : "PRIVATE",
      }),
  });

  if (isChannelAdmin)
    return (
      <>
        <div className="p-4 flex flex-col gap-2">
          <div className=" w-full border text-start  border-gray-300 rounded-[10px] p-3 ">
            <div className="flex pb-3 items-center w-full justify-between">
              <div className=" flex items-center gap-2">
                <RiLockLine className=" size-[24px]" />
                <span>Private Channel</span>
              </div>
              <CustomSlideToggle
                isOn={channel?.privacy === "PRIVATE"}
                toggle={() => handleUpdatePrivacy()}
                disabled={isPending}
                isLoading={isPending}
              />
            </div>
            <div className="    flex flex-col">
              <p>
                By making a channel private, only select members and roles will
                be able to view this channel
              </p>
            </div>
          </div>
          <div className=" w-full border text-start  border-gray-300 rounded-[10px] p-3 ">
            <div className=" flex flex-col">
              <p>Choose who can add and remove users</p>
              <button className="border-gray-300 flex mt-2 justify-between  p-2 border w-[200px] tezx-[14px]">
                <span>Everyone</span>
                <IoChevronDown className="size-[24px]" />
              </button>
            </div>
          </div>
          <button
            onClick={() =>
              toggleModal("channelDeletionModal", {
                channel,
                previous: {
                  data: modalData?.groupDetailsModal,
                  name: "groupDetailsModal",
                },
              })
            }
            className=" w-full border text-start text-red-600 border-gray-300 rounded-[10px] p-3 "
          >
            Delete Channel
          </button>
        </div>
      </>
    );

  return (
    <>
      <>
        <div className="flex justify-center items-center h-full">
          <div className="flex justify-between items-center border-b w-full  px-2">
            <div className="flex items-center py-3">
              <div className="text-[14px] font-Inter ml-2 text-[#808080]">
                Access
              </div>
            </div>
            <GoChevronRight className="size-[24px] text-[#808080]" />
          </div>
        </div>

        <div className="flex justify-center items-center h-full">
          <div className="flex justify-between items-center border-b w-full  px-2">
            <div className="flex items-center py-3">
              <div className="text-[14px] font-Inter ml-2 text-[#808080]">
                Notification setting
              </div>
            </div>
            <GoChevronRight className="size-[24px] text-[#808080]" />
          </div>
        </div>

        {canDeleteGroup && (
          <div className="flex justify-center items-center h-full">
            <button
              onClick={() => {
                toggleModal("deleteGroupModal", {
                  hasBf: Number(group?.bereavementFunds?.length || 0) > 0,
                });
              }}
              className="flex justify-between items-center border-b w-full  px-2"
            >
              <div className="flex items-center py-3">
                <div className="text-[14px] font-Inter ml-2 text-red-600">
                  Delete group
                </div>
              </div>
              <GoChevronRight className="size-[24px] text-[#808080]" />
            </button>
          </div>
        )}
      </>
      <p className="p-4 text-[10px] text-[#808080]">
        Group created by {group?.createdBy?.profile?.firstName} | Created on{" "}
        {moment(group?.createdAt).format("MMM D, YYYY")}
      </p>
    </>
  );
};

export default ChannelSettings;
