"use client";

import { IoClose } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { useSettingModal } from "@/contexts/modal-setting";
import { getGroupMembers } from "@/api/group";

const Members: React.FC<{
  next: () => void;
  back: () => void;
  handleToggleModal: () => void;
}> = ({ handleToggleModal, next }) => {
  const { updateModalData } = useSettingModal();
  const groupId = useParams()?.groupId as string;

  const { data: membersData } = useQuery({
    queryKey: ["members", groupId],
    queryFn: () => {
      if (!groupId || groupId === "undefined") {
        return null;
      }
      return getGroupMembers(groupId, {
        role: "",
      });
    },
    refetchOnWindowFocus: true,
  });

  return (
    <>
      <div className=" max-h-[70vh] w-full overflow-x-auto">
        <div className=" relative ">
          <div className="flex  p-6   flex-col   absolute top-0 right-0 w-full mb-4">
            <div className="justify-end flex w-full pb-6">
              <button
                className="text-gray-500 hover:text-gray-700 w-[32px] h-[32px]  flex items-center justify-center bg-white rounded-full"
                onClick={() => handleToggleModal()}
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-start mt-4">
            <h2 className="text-xl font-bold">Select Member</h2>
            <p className="text-[14px] text-divider-200 mb-6">
              Select the member you wish to add an opening balance for.
            </p>
          </div>

          <div className="bg-primary rounded-sm flex justify-between items-center p-4 text-white">
            <input
              type="text"
              placeholder="Search member"
              className="bg-primary placeholder-white text-white outline-none w-full text-sm font-semibold"
            />
            <span className="text-2xl ml-2">
              <CiSearch />
            </span>
          </div>

          {membersData?.data?.members?.map((member, index) => {
            const user = { ...member.user.profile, id: member.userId };
            return (
              <div
                key={index}
                className="flex items-center justify-between p-1 mt-6 "
              >
                <div className="flex items-center gap-2">
                  <CustomAvatar
                    image={user?.profileImage}
                    className="justify-start w-[50px] h-[50px]"
                    imageClassName="h-[60px] object-top text-[30px] font-bold text-primary border w-[60px] rounded-[12px] overflow-hidden flex items-center justify-center"
                    labelClassName="h-[60px] w-[60px] rounded-[9px] overflow-hidden flex items-center justify-center"
                    alt="profile image"
                    showText={false}
                    disabled={true}
                    iconClassName="w-[30px] h-[30px]"
                    isCurrentUser={false}
                    userFullName={`${user.firstName} ${user.lastName}`}
                  />
                  <div className="leading-tight">
                    <h2 className="font-semibold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">@{user.userName}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    next();
                    updateModalData("transitionWalletModal", { user: user });
                  }}
                  className="border border-gray-400 text-black px-4 py-1 rounded-md"
                >
                  Select
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Members;
