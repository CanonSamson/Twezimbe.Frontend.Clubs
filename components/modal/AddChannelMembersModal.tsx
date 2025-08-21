"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import CustomAvatar from "../custom/CustomAvatar";
import { IoMdClose, IoIosSearch } from "react-icons/io";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPotentialChannelMembers, sendChannelInvite } from "@/api/channel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";

const AddChannelMembersModal = () => {
  const { modals, toggleModal, modalData, closeModal } = useSettingModal();
  const { groupId } = useParams();

  const onlineUsers = useAppSelector(
    (state: RootState) => state.socket.onlineUsers
  );

  const handleClose = () =>
    toggleModal("addChannelMembersModal", { channelId: null });

  const channelId = modalData?.addChannelMembersModal?.channelId;

  const { data, isPending } = useQuery({
    queryKey: ["getPotentialChannelMembers", channelId],
    queryFn: async () =>
      getPotentialChannelMembers(channelId as string, groupId as string),
    enabled: !!channelId,
  });

  useEffect(() => {
    closeModal("addChannelMembersModal");
  }, [groupId]);

  return (
    <div
      className={`${
        modals.addChannelMembersModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-30`}
    >
      <div className="bg-white w-full max-w-[450px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6 relative">
        <div className="flex justify-between items-start p-4">
          <div className="flex flex-col">
            <h2 className="text-[#444444] text-[20px] font-semibold">
              Invite Members
            </h2>
            <span className="text-[20px] text-[#B0B0B0] mt-1">#member</span>
          </div>
          <button onClick={handleClose}>
            <IoMdClose className=" size-[24px]" />
          </button>
        </div>

        <div className="w-full mt-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search for friends"
              className="w-full py-2 pl-4 placeholder:text-white/70 text-white
               pr-10 border border-gray-300 bg-primary rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <IoIosSearch className="absolute text-white right-3 size-[20px]" />
          </div>
        </div>

        <div className="mt-4 max-h-[200px] h-[200px] overflow-x-auto ">
          {isPending && (
            <div className="text-center text-gray-500 mt-4">Loading...</div>
          )}
          {data?.data?.members && data?.data?.members?.length <= 0 ? (
            <div className="text-center text-gray-500 mt-4">
              No members found
            </div>
          ) : (
            <>
              {data?.data?.members?.map((member, index) => {
                const fullName = `${member.user?.profile?.firstName} ${member.user?.profile?.lastName}`;

                return (
                  <Member
                    key={index}
                    isOnline={onlineUsers[member?.userId as string]}
                    fullName={fullName}
                    memberId={member.userId}
                    profileImage={member.user.profile.profileImage}
                    channelId={channelId}
                    groupId={groupId as string}
                  />
                );
              })}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-8 py-2 text-white bg-primary rounded-md transition-colors hover:bg-primary-dark"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const Member = ({
  isOnline,
  fullName,
  profileImage,
  channelId,
  groupId,
  memberId,
}: {
  isOnline: boolean;
  fullName: string;
  profileImage: string;
  channelId: string;
  groupId: string;
  memberId: string;
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sendChannelInvite(channelId, groupId, { receiverId: memberId }),
    onSuccess: () => {
      setIsAdded(true);
    },
  });
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <CustomAvatar
          image={profileImage}
          className="group justify-start w-[45px] h-[45px]"
          imageClassName="h-[45px] object-top text-[16px] font-bold text-primary border w-[45px] rounded-[12px] overflow-hidden flex items-center justify-center"
          labelClassName="h-[45px] border-none w-[45px] rounded-[9px] overflow-hidden flex items-center justify-center"
          alt="profile image"
          showText={false}
          disabled={true}
          iconClassName="w-[30px] h-[30px]"
          isCurrentUser={false}
          userFullName={fullName}
        />
        <div className="flex items-center gap-2">
          <span className="font-medium">{fullName}</span>
          <div
            className={`w-2 h-2 rounded-full ml-2  ${
              isOnline ? " bg-green-600" : " bg-gray-400"
            } `}
          />
        </div>
      </div>

      <button
        disabled={isAdded}
        onClick={() => mutate()}
        className={`px-4 py-2 rounded-md transition-colors ${
          isAdded
            ? "bg-primary text-white cursor-default"
            : " bg-white text-primary border border-primary hover:bg-blue-50"
        } `}
      >
        {isAdded ? "Invited" : isPending ? "Inviting..." : "Invite"}
      </button>
    </div>
  );
};

export default AddChannelMembersModal;
