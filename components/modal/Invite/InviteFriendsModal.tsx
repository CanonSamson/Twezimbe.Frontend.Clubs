"use client";

import { getGroupInviteLink } from "@/api/groupInvite";
import { useSettingModal } from "@/contexts/modal-setting";
import { useAppSelector } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

// Add this import at the top
import { toast } from "sonner";

const InviteFriendsModal = () => {
  const { modals, toggleModal } = useSettingModal();
  const { groups } = useAppSelector((state) => state.group);

  const { groupId } = useParams();

  const inviteFriendsModal = useMemo(() => {
    return modals.inviteFriendsModal;
  }, [modals.inviteFriendsModal, groupId]);

  const isPending = false;

  const handleToggleModal = () => {
    toggleModal("inviteFriendsModal");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getGroupInviteLink", "USER", groupId],
    queryFn: () =>
      getGroupInviteLink(groupId as string, { permission: "USER" }),
    enabled: !!groupId && !!modals.inviteFriendsModal,
  });

  return (
    <>
      <div
        className={`${
          inviteFriendsModal ? "flex" : "hidden"
        } fixed inset-0 z-50 items-center justify-center max-tablet:items-end`}
      >
        <button
          onClick={() => handleToggleModal()}
          disabled={isPending}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            inviteFriendsModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative tablet:w-[440px] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg flex flex-col max-tablet:w-full max-tablet:max-w-none max-tablet:rounded-t-lg max-tablet:rounded-b-none max-tablet:mb-0 max-tablet:bottom-0 max-tablet:h-[70vh]">
          <div className="max-h-[70vh] w-full overflow-x-auto flex-1">
            <div className=" py-4 tablet:py-6">
              <Image
                src="/icon/bar.svg"
                alt="gray-bar"
                width={70}
                height={70}
                className="self-center mb-4 max-tablet:block hidden mx-auto"
              />
              <div className="flex justify-end items-center tablet:px-6">
                <button
                  className="text-divider-200 hover:text-divider-300 duration-500 transition-colors max-tablet:hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleModal();
                  }}
                >
                  <IoClose size={34} />
                </button>
              </div>
              <div className="text-start border-b px-2 tablet:px-6 border-divider pb-6 max-tablet:text-center">
                <h2 className="text-xl font-bold max-tablet:mx-auto max-tablet:text-center">
                  Invite friends to your group
                </h2>
                <p className="text-[14px] text-divider-200 mb-6 max-tablet:text-center">
                  {groups?.[groupId as string]?.name}
                </p>
                <div className="flex items-center bg-primary text-white justify-between px-4 rounded-[5px]">
                  <input
                    type="text"
                    placeholder="Search for friends"
                    className="flex-1 bg-transparent py-1 text-[14px] focus:outline-none h-[50px] placeholder:text-white"
                  />
                  <FiSearch size={20} />
                </div>
              </div>
              <div className="flex flex-col gap-4 text-center text-divider-200 p-6">
                you dont have any friends yet
              </div>
            </div>
          </div>

          <div className="flex bg-primary text-[12px] tablet:text-[14px] justify-between max-tablet-lg:py-4 max-tablet-lg:px-2 tablet:p-4 tablet:min-w-[300px]">
            <div className="flex flex-col w-full text-white duration-200 transition-all">
              <span className="uppercase mobile:text-base text-xs">
                Or send a group invite link to a friend
              </span>
              <span className="bg-white w-full flex my-2 items-center justify-between p-2 rounded-[5px]">
                <span className="text-primary flex-1 pl-2 font-medium truncate max-w-full">
                  {isLoading ? "loading..." : data?.data.link}
                </span>
                <button
                  className="bg-primary rounded-[5px] px-2 mobile:px-4 py-2 flex-shrink-0 text-xs mobile:text-base ml-2"
                  disabled={isLoading || !data?.data.link}
                  onClick={() => {
                    if (data?.data.link) {
                      navigator.clipboard.writeText(data.data.link);
                      toast.success("Link copied to clipboard");
                    }
                  }}
                >
                  Copy
                </button>
              </span>
              <span className="opacity-50 text-xs mobile:text-sm">
                Your invite link expires in 7 days
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteFriendsModal;
