import {
  IoCloseSharp,
  IoNotificationsOffSharp,
  IoNotificationsSharp,
} from "react-icons/io5";
import { BsPinAngleFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useSettingModal } from "@/contexts/modal-setting";
import React from "react";
import Loader from "./loader";
import { HiMiniUserGroup } from "react-icons/hi2";
import { useAppSelector } from "@/lib/hooks";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import GroupSearchModal from "@/components/modal/GroupSearchModal";
import { updateGroupMemberSettings } from "@/api/group";
import { useMutation } from "@tanstack/react-query";

export default function ChannelHeader() {
  const group = useAppSelector((state) => state.group?.group);

  const { channelId, groupId } = useParams();
  const { toggleModal, modals, updateModalData, modalData, closeModal } =
    useSettingModal();

  const channel = group?.channels.find((item) => item.id === channelId);

  const router = useRouter();

  const memberSettings = {
    ...group?.memberSettings,
    mute: group?.memberSettings?.mute || false,
  };

  const { mutate: mutateMute, isPending: muteIsPending } = useMutation({
    mutationFn: (data: { mute?: boolean }) =>
      updateGroupMemberSettings(groupId as string, {
        settings: {
          ...data,
        },
      }),
  });

  if (!group)
    return (
      <div className={`${!!channelId ? "flex " : "hidden tablet-lg:flex"}`}>
        <Loader channelId={channelId ? (channelId as string) : undefined} />
      </div>
    );

  return (
    <div
      className={cn(
        " right-0  max-tablet-lg:absolute z-[40] max-tablet-lg:top-0 w-full border-primary/50 border-b bg-white tablet-lg:bg-[#C3DBEC]  min-h-[60px] h-[60px] flex-col px-5  justify-center",
        !!channelId ? "flex" : "hidden tablet-lg:flex"
      )}
    >
      <div className=" flex justify-between items-center">
        <div className=" flex items-center gap-2">
          <button
            onClick={() => {
              router.push(`/groups/${groupId}`);
            }}
            className="  bg-gray-200 rounded-full h-[24px] w-[24px] flex items-center justify-center tablet-lg:hidden"
          >
            <IoIosArrowRoundBack className=" size-[24px]" />
          </button>
          <div className=" gap-2 flex items-center">
            {channelId && (
              <>
                <span className=" text-[20px] tablet-lg:text-primary/75 ">
                  #
                </span>
                <span className="   font-medium tablet-lg:text-primary">
                  {channel?.name}
                </span>
              </>
            )}
          </div>
        </div>
        <div className=" text-primary flex items-center gap-4">
          <button
            disabled={muteIsPending}
            onClick={() => {
              if (channel?.access) {
                mutateMute({
                  mute: !memberSettings?.mute,
                });
              } else {
                toast("You don't have access");
              }
            }}
            className=" disabled:opacity-50 transition-all duration-300"
          >
            {!memberSettings?.mute ? (
              <IoNotificationsSharp size={20} />
            ) : (
              <IoNotificationsOffSharp size={20} />
            )}
          </button>

          <button
            onClick={() => {
              if (channel?.access) {
                toggleModal("pinnedMessageModal");
              } else {
                toast("You don't have access");
              }
            }}
          >
            <BsPinAngleFill size={25} />
          </button>

          <button
            onClick={() => toggleModal("groupDetailsModal")}
            className=" hidden tablet:flex"
          >
            <HiMiniUserGroup size={20} />
          </button>
          <button
            onClick={() => {
              router.push(`/groups/${groupId}/${channelId}/details/members`);
            }}
            className=" fiex tablet:hidden"
          >
            <HiMiniUserGroup size={20} />
          </button>

          <div className="  max-tablet-lg:hidden flex items-center  bg-primary text-white  px-2 rounded-[5px]">
            <GroupSearchModal />

            <input
              type="text"
              value={modalData?.groupSearchModal?.search || ""}
              placeholder="Search"
              className=" bg-transparent py-1 text-[14px] focus:outline-none placeholder:text-white"
              onChange={(e) => {
                updateModalData("groupSearchModal", {
                  search: e.target.value,
                });
              }}
              onFocus={(e) => {
                toggleModal("groupSearchModal", {
                  search: e.target.value,
                });
              }}
            />
            {modalData?.groupSearchModal?.search && modals?.groupSearchModal ? (
              <button
                className=" "
                onClick={() => {
                  closeModal("groupSearchModal");
                }}
              >
                <IoCloseSharp size={20} />
              </button>
            ) : (
              <FiSearch size={20} />
            )}
          </div>
          <button className=" tablet-lg:hidden">
            <FiSearch size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
