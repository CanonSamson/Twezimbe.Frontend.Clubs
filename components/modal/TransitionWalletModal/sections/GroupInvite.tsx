"use client";

import { IoClose } from "react-icons/io5";

import Image from "next/image";
import { getGroupInviteLink } from "@/api/groupInvite";
import { useParams, useRouter } from "next/navigation";
import { useSettingModal } from "@/contexts/modal-setting";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const GroupInvite: React.FC<{
  next: () => void;

  handleToggleModal: () => void;
}> = ({ next, handleToggleModal }) => {
  const { modals } = useSettingModal();
  const groupId = useParams()?.groupId as string;
  const bfId = useParams()?.bfId as string;
  const router = useRouter();
  const { toggleModal } = useSettingModal();

  const { data, isLoading } = useQuery({
    queryKey: ["getGroupInviteLink", "USER", groupId],
    queryFn: () => getGroupInviteLink(groupId, { permission: "USER" }),
    enabled: !!groupId && !!modals.transitionWalletModal,
  });

  const handleClick = () => {
    toggleModal("transitionWalletModal");
    router.push(`/bf/settings/${groupId}/${bfId}/transition-wallet/member`);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-end items-center mb-4">
          <button
            className="text-divider-200 hover:text-divider-300 duration-500 transition-colors"
            onClick={handleToggleModal}
          >
            <IoClose size={34} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Image
            src="/icon/important.svg"
            alt="important"
            width={150}
            height={150}
            className=" w-auto h-[150px]"
          />
          <div className="text-start mt-5">
            <h2 className="text-xl font-bold text-center">Important!</h2>
            <p className="text-[14px] text-divider-200 mb-6 text-center">
              To log a member’s balance in the transition wallet, they must
              first be added to your group. Please ensure all members are fully
              registered before recording any contributions.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-[#DADADA63] p-1">
          <div className="flex items-center justify-between">
            <h1 className="text-primary break-all">
              {isLoading ? "loading..." : data?.data.link}
            </h1>
            <button
              onClick={() => {
                if (data?.data.link) {
                  navigator.clipboard.writeText(data.data.link);
                  toast.success("Link copied to clipboard");
                }
              }}
              className="rounded-md text-white px-4 py-1 cursor-pointer bg-primary "
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="hidden tablet-lg:flex bg-white p-3 gap-3">
        <button
          className="w-full px-4 py-2 bg-primary text-white rounded-sm"
          onClick={next}
        >
          Next
        </button>
      </div>
      <div className=" tablet-lg:hidden flex bg-white p-3 gap-3">
        <button
          className="w-full px-4 py-2 bg-primary text-white rounded-sm"
          onClick={handleClick}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default GroupInvite;
