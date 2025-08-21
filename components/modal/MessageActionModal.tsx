import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { BsPinAngle } from "react-icons/bs";
import { CgMailReply } from "react-icons/cg";
import { LuCopy, LuReplyAll } from "react-icons/lu";
import { MdOutlineCopyAll } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UserContext, UserContextType } from "@/contexts/user";
import { useContextSelector } from "use-context-selector";
import { Context, useMemo } from "react";
import { addReaction } from "@/api/messaging/group/reaction";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import {
  removeMesageInEdit,
  setMesageInEdit,
} from "@/lib/features/groups/groupMessageInEditSlice";
import {
  removeMesageInReply,
  setMesageInReply,
} from "@/lib/features/groups/groupMessageInReplySlice";
import { QuillContext, QuillContextType } from "@/contexts/quill";
import { copyToClipboard } from "@/utils/functions/copyToClipboard";

const MessageActionModal = () => {
  const { modals, toggleModal, modalData, closeModal } = useSettingModal();

  const { channelId, groupId } = useParams();

  const handleFocusOnEditer = useContextSelector(
    QuillContext,
    (state: QuillContextType) => state?.handleFocus
  );

  const message = modalData?.messageActionModal?.message;
  const currentUser = useContextSelector(
    UserContext as Context<UserContextType>,
    (state: UserContextType) => state.currentUser
  );


  const isCurrentUser = useMemo(
    () => message?.user?.id === currentUser?.id,
    [message, currentUser?.id]
  );

  const favoriteEmoji = [
    ...(currentUser?.favoriteEmoji || []),
    "😂",
    "🔥",
    "🥰",
    "👍",
  ];

  const onEmojiSelect = (emoji: string) => {
    console.log(emoji, "emoji");
    try {
      mutate(emoji);
    } catch (error) {
      console.log(error);
    }
  };
  const { mutate } = useMutation({
    mutationFn: (emoji: string) =>
      addReaction(message?.id, {
        emoji,
        groupId: groupId as string,
        channelId: channelId as string,
      }),
    onSuccess: () => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
    onMutate: () => {
      closeModal("messageActionModal");
    },
  });

  const dispatch = useAppDispatch();
  const handleSetMessageInReply = () => {
    closeModal("messageActionModal");

    dispatch(
      removeMesageInEdit({
        channelId,
        groupId,
      })
    );
    dispatch(
      setMesageInReply({
        channelId,
        groupId,
        message,
      })
    );
    setTimeout(() => handleFocusOnEditer(), 200);
  };

  const handleSetMessageInEdit = () => {
    closeModal("messageActionModal");

    dispatch(
      removeMesageInReply({
        channelId,
        groupId,
      })
    );
    dispatch(
      setMesageInEdit({
        channelId,
        groupId,
        message,
      })
    );
    setTimeout(() => handleFocusOnEditer(), 200);
  };

  return (
    <div
      onClick={() => toggleModal("messageActionModal")}
      className={`${
        modals.messageActionModal ? "flex" : "hidden"
      } tablet:hidden fixed left-0 w-full bg-black/30 text-[12px] right-0 top-0 bottom-0 items-center justify-center z-[55] max-tablet:items-end max-tablet:bottom-0`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F9F9F9F9] w-full flex flex-col rounded-[10px] p-4
             max-tablet:rounded-t-[10px]
             max-tablet:rounded-b-none max-tablet:max-h-[80dvh]
             max-tablet:mb-0 max-tablet:mt-4"
      >
        <Image
          src="/icon/bar.svg"
          alt="gray-bar"
          width={70}
          height={70}
          className="self-center mb-4 max-tablet:block hidden"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleModal("messageActionModal");
          }}
          className="text-divider-200 w-[28px] pb-4 ml-auto max-tablet:hidden"
        >
          <IoMdClose size={24} />
        </button>

        {/* This is the emoji section */}
        <div className="flex justify-center items-center gap-x-2 mobile:gap-x-3 tablet:gap-x-4">
          {favoriteEmoji?.slice(0, 4).map((item, index) => {
            return (
              <div
                key={index}
                className="flex-1 flex items-center justify-center"
              >
                <button
                  onClick={() => {
                    onEmojiSelect(item);
                  }}
                  className="max-tablet:block hidden bg-[#DADADA] rounded-full w-[7dvh] h-[7dvh] leading-none text-center justify-center items-center"
                >
                  <p className="text-[3.5dvh] text-center justify-center items-center">
                    {item}
                  </p>
                </button>
              </div>
            );
          })}
        </div>

        {/*These are the reply, forward and save section */}
        <div className="grid grid-cols-6 justify-center items-center gap-x-4 mt-4">
          <button
            onClick={handleSetMessageInReply}
            className="col-span-2 bg-white rounded-md p-2 flex flex-col items-center"
          >
            <Image
              src="/icon/reply.svg"
              alt="reply icon"
              width={100}
              height={100}
              className=" h-[24px] w-auto object-cover "
            />
            <span className="mt-2 text-sm">Reply</span>
          </button>
          <button className="col-span-2 bg-white rounded-md p-2 flex flex-col items-center">
            <Image
              src="/icon/forward.svg"
              alt="forward icon"
              width={100}
              height={100}
              className=" h-[24px] w-auto object-cover "
            />
            <span className="mt-2 text-sm">Forward</span>
          </button>
          <button className="col-span-2 bg-white rounded-md p-2 flex flex-col items-center">
            <Image
              src="/icon/save.svg"
              alt="save icon"
              width={100}
              height={100}
              className=" h-[24px] w-auto object-cover "
            />
            <span className="mt-2 text-sm">Save</span>
          </button>
        </div>

        {/* The last Section*/}
        <div className="bg-white w-full mt-4 divide-y divide-gray-200 rounded-md overflow-hidden">
          <div className="py-2 px-4 ">
            <div className="flex justify-between items-center w-full mb-1 gap-x-4">
              <h1 className="font-inter text-[12px] mb-4">Mark as read</h1>
              <Image
                src="/icon/message.svg"
                alt="mark as read"
                width={60}
                height={60}
                className="ml-2 text-[#616061] h-[18px] w-auto"
              />
            </div>
            <button
              onClick={() => toggleModal("confirmPinMessageModal", message)}
              className="flex justify-between items-center w-full gap-x-4"
            >
              <p className="font-inter text-[12px]">Pin message</p>
              <BsPinAngle size={20} className="text-[#616061]" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(message.text);
              }}
              className="flex justify-between items-center w-full gap-x-4"
            >
              <p className="font-inter text-[12px]">Copy Text</p>
              <LuCopy className=" size-[16px]" />
            </button>
          </div>

          <div className="py-2 px-4">
            <button
              onClick={handleSetMessageInReply}
              className="flex justify-between items-center w-full mb-1 gap-x-4"
            >
              <h1 className="font-inter text-[12px] mb-4">Reply</h1>
              <CgMailReply size={20} className="text-[#616061]" />
            </button>

            <div className="flex justify-between items-center w-full gap-x-4">
              <p className="font-inter text-[12px]">Forward</p>
              <LuReplyAll
                style={{ transform: "scaleX(-1)" }}
                className="text-[#616061] size-[18px]"
              />
            </div>
          </div>

          <div className="py-2 px-4">
            {isCurrentUser && (
              <button
                onClick={handleSetMessageInEdit}
                className="flex justify-between items-center w-full mb-1 gap-x-4"
              >
                <h1 className="font-inter text-[12px] mb-4">Edit</h1>
                <Image
                  src="/icon/edit.svg"
                  alt="edit"
                  width={60}
                  height={60}
                  className="ml-2 text-[#616061] h-[18px] w-auto"
                />
              </button>
            )}

            <div className="flex justify-between items-center w-full gap-x-4">
              <p className="font-inter text-[12px]">Copy Text</p>
              <MdOutlineCopyAll className="text-[#616061] size-[18px]" />
            </div>
          </div>

          {isCurrentUser ? (
            <button
              onClick={() => toggleModal("deleteMessageModal", message)}
              className="py-2 px-4 w-full"
            >
              <div className="flex justify-between items-center w-full gap-x-4">
                <h1 className="relative font-inter text-[12px] mb-4 self-center top-2">
                  Delete
                </h1>
                <RiDeleteBin6Line className="text-[#616061 size-[18px]" />
              </div>
            </button>
          ) : (
            <button className="py-2 px-4 w-full">
              <div className="flex justify-center items-center w-full gap-x-4">
                <h1 className="relative top-0 font-inter text-[12px] mb-6 text-[#DE3108]">
                  Report message
                </h1>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageActionModal;
