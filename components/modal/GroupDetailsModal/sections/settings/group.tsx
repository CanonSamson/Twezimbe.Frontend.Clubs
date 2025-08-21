"use client";

import moment from "moment";
import { GoChevronRight } from "react-icons/go";
import { ChannelType, GroupType } from "@/types/groups";
import useGroup from "@/hooks/userGroup";
import { useSettingModal } from "@/contexts/modal-setting";
interface SettingsProps {
  group: GroupType | undefined | any;
  channel: ChannelType | undefined;
}

export const GroupSettings = ({ group }: SettingsProps) => {
  const { canDeleteGroup } = useGroup();
  const { toggleModal, modalData } = useSettingModal();

  return (
    <>
      <>
        <div className="flex justify-center items-center h-full">
          <button
            onClick={() => {
              toggleModal("groupAccessModal", {
                previous: {
                  name: "groupDetailsModal",
                  data: modalData?.groupDetailsModal,
                },
              });
            }}
            className="flex justify-between items-center border-b w-full  px-2"
          >
            <div className="flex items-center py-3">
              <div className="text-[14px] font-Inter ml-2 text-[#808080]">
                Access
              </div>
            </div>
            <GoChevronRight className="size-[24px] text-[#808080]" />
          </button>
        </div>

        <div className="flex justify-center items-center h-full">
          <button
            onClick={() => {
              toggleModal("notificationSettingModal");
            }}
            className="flex justify-between items-center border-b w-full  px-2"
          >
            <div className="flex items-center py-3">
              <div className="text-[14px] font-Inter ml-2 text-[#808080]">
                Notification setting
              </div>
            </div>
            <GoChevronRight className="size-[24px] text-[#808080]" />
          </button>
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

export default GroupSettings;
