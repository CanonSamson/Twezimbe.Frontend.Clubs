import { RxDotsVertical } from "react-icons/rx";
import Hint from "../../Hint";
import { HiOutlineReply } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscReply } from "react-icons/vsc";
import { LuCopy } from "react-icons/lu";
import { MdOutlinePushPin } from "react-icons/md";
import { useAppDispatch } from "@/lib/hooks";
import { MessageType } from "@/api/messaging/group";
import { useParams } from "next/navigation";
import {
  removeMesageInReply,
  setMesageInReply,
} from "@/lib/features/groups/groupMessageInReplySlice";
import EmojiPopover from "../../emojiPopover";
import { Smile } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addReaction } from "@/api/messaging/group/reaction";
import { useSettingModal } from "@/contexts/modal-setting";
import {
  removeMesageInEdit,
  setMesageInEdit,
} from "@/lib/features/groups/groupMessageInEditSlice";
import { QuillContext, QuillContextType } from "@/contexts/quill";
import { useContextSelector } from "use-context-selector";
import { copyToClipboard } from "@/utils/functions/copyToClipboard";
import { DmMessageType } from "@/api/dms/messaging";

const Integration = ({
  hidden,
  isCurrentUser,
  moreActions,
  setMoreActions,
  message,
  favoriteEmoji,
}: {
  hidden: boolean;
  isCurrentUser: boolean;
  setMoreActions: React.Dispatch<React.SetStateAction<boolean>>;
  moreActions: boolean;
  message: MessageType |DmMessageType;
  favoriteEmoji?: string[];
}) => {
  const { groupId, channelId } = useParams();

  const dispatch = useAppDispatch();

  const handleFocusOnEditer = useContextSelector(
    QuillContext,
    (state: QuillContextType) => state?.handleFocus
  );

  const handleSetMessageInReply = () => {
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

  const onEmojiSelect = (emoji: string) => {
    try {
      mutate(emoji);
    } catch (error) {
      console.log(error);
    }
  };
  const { mutate } = useMutation({
    mutationFn: (emoji: string) =>
      addReaction(message.id, {
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
  });
  const { toggleModal } = useSettingModal();

  const pinned = !!message?.pinned && message.pinned.length > 0;

  return (
    <button
      className={`z-20 shadow absolute hover:bg-gray-50 rounded-[10px] border-[#DDDDDD] border
    transition-opacity duration-200 ${
      isCurrentUser ? "top-[-20px] right-5  " : "bottom-[-20px]  left-5 "
    } ${hidden && !moreActions ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex items-center justify-end p-1">
        <div className="flex items-center gap-1 ">
          {favoriteEmoji?.map((emoji, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onEmojiSelect(emoji);
              }}
              className="text-[16px]  duration-600 transition-all hover:bg-[#88B7D8]/40 flex items-center gap-[4px] rounded-xl p-[4px] px-[10px]"
            >
              <span>{emoji}</span>
            </button>
          ))}
          <EmojiPopover
            side={"bottom"}
            disabled={false}
            onEmojiSelect={onEmojiSelect}
          >
            <div className="p-2 rounded-full">
              <Smile className="size-4" />
            </div>
          </EmojiPopover>
          <Hint label="Reply" handleClick={handleSetMessageInReply}>
            <div className="p-[4px] rounded bg-gray-100">
              <HiOutlineReply className="size-4" />
            </div>
          </Hint>
          {isCurrentUser ? (
            <Hint label="Edit" handleClick={handleSetMessageInEdit}>
              <div className="p-[4px] rounded bg-gray-100">
                <MdEdit className="size-4" />
              </div>
            </Hint>
          ) : null}

          <DropdownMenu
            open={moreActions}
            onOpenChange={(open) => setMoreActions(open)}
          >
            <DropdownMenuTrigger asChild>
              <div className="p-[4px] rounded bg-gray-100">
                <RxDotsVertical className="size-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isCurrentUser ? "end" : "start"}
              className="w-56 bg-white text-[14px]"
            >
              <DropdownMenuItem
                onClick={handleSetMessageInReply}
                className=" hover:bg-gray-50 p-[5px] mt-[5px] py-[7px]"
              >
                Reply
                <DropdownMenuShortcut>
                  <VscReply className=" size-[16px] " />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="  bg-divider-100" />

              <DropdownMenuGroup>
                {isCurrentUser ? (
                  <>
                    <DropdownMenuItem
                      onClick={handleSetMessageInEdit}
                      className=" hover:bg-gray-50 p-[5px] mt-[5px] py-[7px]"
                    >
                      Edit
                      <DropdownMenuShortcut>
                        <AiOutlineEdit className=" size-[16px]" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <></>
                )}

                <DropdownMenuItem className=" hover:bg-gray-50 p-[5px] mt-[5px] py-[7px]">
                  Forward
                  <DropdownMenuShortcut>
                    <VscReply className=" size-[16px] rotate-180" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="  bg-divider-100" />

              <DropdownMenuGroup>
                {message.text ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(message.text);
                    }}
                    className=" hover:bg-gray-50 p-[5px] mt-[5px] py-[7px]"
                  >
                    Copy Text
                    <DropdownMenuShortcut>
                      <LuCopy className=" size-[16px]" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ) : null}

                {pinned ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModal("confirmUnPinMessageModal", message);
                    }}
                    className=" hover:bg-gray-50 p-[5px] mt-[5px] py-[7px]"
                  >
                    Unpin Message
                    <DropdownMenuShortcut>
                      <MdOutlinePushPin className=" size-[16px]" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModal("confirmPinMessageModal", message);
                    }}
                    className=" hover:bg-gray-50 p-[5px] mt-[5px] py-[7px]"
                  >
                    Pin Message
                    <DropdownMenuShortcut>
                      <MdOutlinePushPin className=" size-[16px]" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="  bg-divider-100" />

              <DropdownMenuGroup>
                {isCurrentUser ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModal("deleteMessageModal", message);
                    }}
                    className="hover:bg-gray-50 p-[5px] mt-[5px] text-red-600 py-[7px]"
                  >
                    Delete Message
                    <DropdownMenuShortcut>
                      <RiDeleteBin6Line className="text-red-600 size-[16px]" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="  text-[14px] flex items-center justify-center hover:bg-gray-50 p-[5px] mt-[5px] text-center text-red-600 py-[7px]">
                    Report Message
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </button>
  );
};

export default Integration;
