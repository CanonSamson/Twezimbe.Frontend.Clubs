"use client";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomAvatar from "../custom/CustomAvatar";
import moment from "moment";
import { MessageType } from "@/api/messaging/group";
import TextRenderer from "../TextRenderer";
import { useMutation } from "@tanstack/react-query";
import {  unpinMessage } from "@/api/messaging/group/pinMessage";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { UserContext, UserContextType } from "@/contexts/user";
import { useContextSelector } from "use-context-selector";

const ConfirmUnPinMessageModal = () => {
  const { modals, modalData, closeModal, toggleModal } = useSettingModal();
  const data = modalData?.confirmUnPinMessageModal as MessageType | undefined;
  const  groupId  = useParams()?.groupId as string
  const otherUserId = useParams()?.otherUserId as string

    const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  )

  console.log(otherUserId, "otherUserId")
  
  const user = {
    id: data?.user?.id || currentUser?.id,
    firstName: data?.user?.profile?.firstName || currentUser?.profile.firstName,
    lastName: data?.user?.profile?.lastName || currentUser?.profile.lastName,
    profileImage:
      data?.user?.profile?.profileImage || currentUser?.profile.profileImage
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => unpinMessage(data?.id as string, groupId as string),
    onError: (error) => {
      toast.error(error.message || JSON.stringify(error));
    },
    onSuccess: (data) => {
      closeModal("confirmUnPinMessageModal");
      toast(data.data.message || "Message has been unpinned.", {
        description: "Click to view pinned messages.",
        action: {
          label: "View",
          onClick: () => {
            toggleModal("pinnedMessageModal");
          },
        },
      });
    },
  });

  return (
    <div
      onClick={() => closeModal("confirmUnPinMessageModal")}
      className={`${
        modals.confirmUnPinMessageModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-[55]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto max-w-tablet z-10 p-6 tablet:mx-auto mx-4 custom-modal"
      >
        <div className="text-start mb-4">
          <h4 className="text-[20px] font-Inter">Unpin message.</h4>
          <p className="text-[12px] mt-2 font-Roboto">
            Are you sure you want to unpin this message?
          </p>
        </div>

        <div className="bg-[#F5F5F5] flex flex-col rounded-lg shadow-sm w-full p-4 ">
          <div className="flex items-start gap-2 ">
            <div className="flex-1">
              <div className="flex items-baseline gap-4">
                <h1 className="text-[15px] font-Inter">
                  {user?.firstName}
                </h1>
                <span className="text-[12px] text-gray-500 font-Lato">
                  {moment(data?.createdAt).format("h:mm A")}
                </span>
              </div>
              <p className=" text-[15px]  text-start font-Roboto">
                {data?.text && (
                  <TextRenderer value={data?.text} maxLength={200} />
                )}
              </p>
            </div>
            <CustomAvatar
              image={user?.profileImage}
              userFullName={`${user?.firstName} ${user?.lastName}`}
              className="relative top-0"
              imageClassName="w-[50px] h-[50px] rounded-[10px] border overflow-hidden object-top text-[32px] font-bold text-primary"
              labelClassName="flex w-[50px] h-[50px] items-center justify-center overflow-hidden rounded-[10px]"
              alt="profile image"
              showText={false}
              disabled={true}
              isCurrentUser={false}
              iconClassName="size-[28px]"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-4 items-center">
          <button
            onClick={() => closeModal("confirmUnPinMessageModal")}
            className="py-2 px-3 border rounded w-24 text-primary"
          >
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            className="py-2 px-3 flex bg-primary text-white rounded "
          >
            Remove it, please! {isPending ? "..." : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUnPinMessageModal;
