import Image from "next/image";
import { getUserNameInitials } from "@/utils/functions/getNameInitials";
import moment from "moment";
import { Context, FC, useMemo, useRef, useState } from "react";
import { MessageType } from "@/api/messaging/group";
import Hint from "@/components/Hint";
import Integration from "@/components/channel/chatArea/Integration";
import { UserContext, UserContextType } from "@/contexts/user";
import TextRenderer from "@/components/TextRenderer";
import UserProfileHint from "@/components/UserProfileHint";
import FileCards from "./upload-files/FileCards";
import { useContextSelector } from "use-context-selector";
import { GroupMemberType } from "@/api/group";
import { addReaction, removeReaction } from "@/api/messaging/group/reaction";
import { useParams } from "next/navigation";
import { useSettingModal } from "@/contexts/modal-setting";
import { RiPushpinFill } from "react-icons/ri";

interface MessageProps {
  message: MessageType;
  members: GroupMemberType[] | undefined;
}
const Message: FC<MessageProps> = ({ message, members }) => {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const { groupId, channelId } = useParams();
  const [isHovered, setIsHovered] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { toggleModal } = useSettingModal();
  const currentUser = useContextSelector(
    UserContext as Context<UserContextType>,
    (state: UserContextType) => state.currentUser
  );
  const [moreActions, setMoreActions] = useState<boolean>(false);
  const isCurrentUser = useMemo(
    () => message.user.id === currentUser?.id,
    [message, currentUser?.id]
  );

  const user = {
    id: message.user.id,
    firstName: message?.user?.profile?.firstName,
    lastName: message?.user?.profile?.lastName,
    profileImage: message?.user?.profile?.profileImage,
    userName: message?.user?.profile?.userName,
  };

  const messageReaction = useMemo(() => {
    const reactions = message.messageReaction || [];
    const reactionMap = new Map<
      string,
      { count: number; userId: { [userId: string]: string } }
    >();

    reactions.forEach((reaction) => {
      const existing = reactionMap.get(reaction.emoji) || {
        count: 0,
        userId: {},
      };
      reactionMap.set(reaction.emoji, {
        count: existing.count + 1,
        userId: {
          ...existing.userId,
          [reaction.userId]: reaction.id,
        },
      });
    });

    const reactionArray: {
      emoji: string;
      count: number;
      userId: { [userId: string]: string };
    }[] = [];
    reactionMap.forEach((value, emoji) => {
      reactionArray.push({
        emoji,
        count: value.count,
        userId: value.userId,
      });
    });

    return reactionArray;
  }, [message.messageReaction]);

  const handleRemoveReaction = async (data: {
    emoji: string;
    reactionId: string;
  }) => {
    try {
      await removeReaction(message.id, {
        groupId: groupId as string,
        channelId: channelId as string,
        reactionId: data.reactionId,
        emoji: data.emoji,
      });
    } catch {}
  };
  const handleAddReaction = async (data: { emoji: string }) => {
    try {
      await addReaction(message.id, {
        emoji: data.emoji,
        groupId: groupId as string,
        channelId: channelId as string,
      });
    } catch {}
  };

  const isRead = message?.messageRead == null || !!message?.messageRead?.isRead;

  const handleMouseDown = () => {
    holdTimerRef.current = setTimeout(() => {
      console.log("Message held down");
      toggleModal("messageActionModal", {
        message,
        favoriteEmoji: currentUser?.favoriteEmoji,
      });
      // Handle long press here (e.g., show options)
    }, 600); // 600ms = user has to hold for 0.6 seconds
  };

  const handleMouseUp = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  };

  const pinned = !!message?.pinned && message.pinned.length > 0;
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`tablet:px-10 w-full mt-5 relative   prevent-select  flex flex-col ${
        isCurrentUser ? "  items-end " : " items-start"
      }  `}
      id={message.id}
    >
      
      {message.system == false && (
        <div className="relative hidden tablet:flex">
          <Integration
            moreActions={moreActions}
            setMoreActions={setMoreActions}
            isCurrentUser={isCurrentUser}
            hidden={!isHovered}
            message={message}
            favoriteEmoji={currentUser?.favoriteEmoji}
          />
        </div>
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleModal("messageActionModal", {
            message,
            favoriteEmoji: currentUser?.favoriteEmoji,
          });
        }}
        className={` relative max-w-[95%] tablet:max-w-[60%]  ${
          isCurrentUser
            ? "flex ml-auto"
            : "flex items-start justify-start mr-auto"
        }`}
      >
        <div
          ref={messageRef}
          className={`${
            isCurrentUser
              ? `rounded-[20px]  rounded-br-none ${
                  isHovered ? "bg-[#F5F5F5] " : " bg-[#F5F5F5]/60"
                }`
              : `rounded-[20px]  rounded-bl-none ${
                  isHovered
                    ? "bg-[#F5F5F5]/60"
                    : isRead
                    ? " bg-[#808080]/10"
                    : " bg-[#F9DFC9]/30"
                }`
          } p-4 flex flex-col `}
        >
          {message.replyMessage ? (
            <>
              <div
                className={`   cursor-pointer mb-4 min-w-[300px] flex relative gap-2   text-[14px] rounded-[10px] pl-4 p-2 ${
                  isCurrentUser ? "bg-[#E6E6E6]" : " bg-[#ECEFF2]"
                }`}
                onClick={(e) => {
                  e.stopPropagation();

                  const messageElement = document.getElementById(
                    `${message.replyMessage?.id}`
                  );
                  if (messageElement) {
                    messageElement.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                <div
                  className={`w-full border-l-[4px]  ${
                    isCurrentUser ? "border-primary" : " border-secondary"
                  }`}
                >
                  <div className=" flex items-center w-full pl-2 justify-between ">
                    <span>
                      {message.replyMessage?.user?.profile?.firstName}{" "}
                      {message.replyMessage?.user?.profile?.lastName}
                    </span>
                    <span>
                      @{message.replyMessage?.user?.profile?.userName}
                    </span>
                  </div>
                  <div className="mt-3 pl-2">
                    {message.replyMessage.text && (
                      <TextRenderer
                        value={message.replyMessage.text}
                        members={members}
                        isCurrentUser={isCurrentUser}
                        maxLength={200}
                      />
                    )}

                    {message.replyMessage?.files?.length ? (
                      <div className=" italic">
                        message with {message.replyMessage.files.length} file
                        {message.replyMessage.files.length > 1 ? "s" : ""}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <div
            className={` flex items-top  items-start justify-start ${
              !isCurrentUser ? "flex-row-reverse " : "flex ml-auto"
            }`}
          >
            <div
              ref={messageRef}
              className={`z-10 flex items-start justify-start flex-col ${
                isCurrentUser ? "" : " mr-auto  "
              } `}
            >
              <div
                className={`z-10  inline-flex items-start gap-4 transition-all rounded-[5px]  relative ${
                  isCurrentUser ? `flex-row-reverse ` : `  `
                }`}
              >
                <div
                  className={`${
                    isCurrentUser
                      ? " ml-auto flex-1  flex justify-end"
                      : " flex-1  flex  items-start justify-start"
                  }`}
                >
                  <UserProfileHint
                    align={isCurrentUser ? "end" : "start"}
                    user={user}
                  >
                    {message?.user?.profile?.profileImage || message.system ? (
                      <Image
                        src={
                          message.system
                            ? "/icon/logo.svg"
                            : message?.user?.profile?.profileImage ||
                              "/avatar/2.svg"
                        }
                        className={`w-[50px] min-w-[50px]  h-[50px] object-top rounded-xl
                            object-cover bg-white flex items-center justify-center `}
                        width={200}
                        height={200}
                        alt={message?.user?.profile.firstName}
                      />
                    ) : (
                      <div
                        className="w-[50px] aspect-square rounded-xl 
                    bg-white flex items-center font-bold font-inter justify-center
                     text-primary text-[24px] uppercase "
                      >
                        {getUserNameInitials(
                          message?.user?.profile?.firstName,
                          message?.user?.profile?.lastName
                        )}
                      </div>
                    )}
                  </UserProfileHint>
                </div>
                <div className="">
                  <div className="flex items-center gap-2">
                    <UserProfileHint
                      align={isCurrentUser ? "end" : "start"}
                      user={user}
                    >
                      <h5
                        className={`text-[18px]  prevent-select  font-semibold hover:underline duration-200 transition-all  cursor-pointer ${
                          message.system ? " italic" : ""
                        }`}
                      >
                        {message.system
                          ? "twezi"
                          : message?.user?.profile?.firstName}
                      </h5>
                    </UserProfileHint>

                    <div className="flex items-center gap-2 text-[#616061]">
                      <Hint label={moment().format("MMM D, h:mm A")}>
                        <p className="text-[12px]  prevent-select  uppercase cursor-pointer hover:underline duration-200 transition-all">
                          {moment(message.createdAt).format("h:mm A")}
                        </p>
                      </Hint>
                      {message.edited && (
                        <p className="text-[12px]  prevent-select   cursor-pointer duration-200 transition-all">
                          (Edited)
                        </p>
                      )}
                    </div>
                  </div>
                  {message.system ? (
                    <p className=" lowercase italic ">
                      {message?.user?.profile?.firstName}{" "}
                      {message?.user?.profile?.lastName}{" "}
                      {message.event === "user left"
                        ? "left group"
                        : "joined group"}
                    </p>
                  ) : (
                    <TextRenderer
                      value={message.text}
                      members={members}
                      isCurrentUser={isCurrentUser}
                    />
                  )}
                  {message?.files && (
                    <FileCards message={message} files={message?.files} />
                  )}
                </div>
              </div>
              {messageReaction?.length > 0 && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {messageReaction?.map((reaction, index) => {
                    const reacted =
                      reaction.userId?.[currentUser?.id as string];
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (reacted) {
                            handleRemoveReaction({
                              emoji: reaction.emoji,
                              reactionId:
                                reaction.userId?.[currentUser?.id as string],
                            });
                          } else {
                            handleAddReaction({
                              emoji: reaction.emoji,
                            });
                          }
                        }}
                        className={`text-[16px] ${
                          reacted ? "bg-[#88B7D8]/40" : "bg-[#88B7D8]/20"
                        } flex items-center gap-[4px] rounded-xl p-[4px] px-[10px]`}
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {pinned && (
              <div className={`${!isCurrentUser ? " pr-1" : ""}`}>
                <RiPushpinFill
                  className={`text-primary size-[20px] ${
                    !isCurrentUser ? "rotate-[-90deg] " : ""
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
