import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "@/lib/hooks";
import ChatAreaLoader from "./loader";
import useGroup from "@/hooks/userGroup";
import { IoArrowUpSharp } from "react-icons/io5";
import { RootState } from "@/lib/store";
import ChatInput from "../ChatInput";
export default function ChatAreaLayout({
  children,
  scrollToBottom,
  isAtBottonArea,
}: {
  scrollToBottom: () => void;
  children: React.ReactNode;
  isAtBottonArea: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { groupId, channelId } = useParams();
  const { isDragging, handleDrop, handleDragOver, handleDragLeave } =
    useGroup();

  const group = useAppSelector(
    (state: RootState) => state.group.groups?.[groupId as string]
  );
  const channelMessagesLoading = useAppSelector(
    (state: RootState) =>
      state.groupMessage.groupLoading?.[groupId as string]?.[
        channelId as string
      ]?.messages ?? true
  );

  const groupLoadingData = useAppSelector(
    (state: RootState) =>
      state.group.groupLoadingData?.[groupId as string] ?? true
  );

  const channel = group?.channels?.find((item) => item.id === channelId)
  
  const messages = useAppSelector(
    (state: RootState) =>
      state.groupMessage.channelMessages?.[groupId as string]?.[
        channelId as string
      ]?.messages
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const isLoading = useMemo(() => {
    // Early return if essential data is not available
    if (!channel || !groupId) return true;

    if (channel && channel.access === false) return false;
    return groupLoadingData || channelMessagesLoading;
  }, [groupLoadingData, channelMessagesLoading, channel, groupId]);

  return (
    <div
      className={` h-[calc(99dvh-64px)]  tablet-lg:flex-1 relative   ${
        isDragging ? "bg-gray-100" : "bg-gray-50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0  z-[55] flex items-center justify-center" />
      )}
      {isDragging && (
        <div className="absolute inset-0 bg-gray-500/30 z-50 flex items-center justify-center">
          <div className=" text-white p-4 ">
            <Image
              src="/assets/images/random/picture-1.png"
              className=" w-[30%] max-w-[200px] h-auto mx-auto flex items-center justify-center"
              height={100}
              width={100}
              alt="upload-files"
            />
            <h4 className=" text-center text-xl font-semibold">
              {" "}
              Upload to {group.name} Group
            </h4>
            <div className=" items-center gap-2 inline-flex">
              <span className="text">Hold</span>
              <div className=" text-black flex items-center gap-1 p-[4px] rounded-[5px] bg-white">
                <span>Shift</span>
                <IoArrowUpSharp size={20} />
              </div>
              <span className="text">
                to immediately share with {group.name} Group
              </span>
            </div>
          </div>
        </div>
      )}

      {isLoading ? <ChatAreaLoader /> : null}
      <Image
        width={400}
        height={400}
        alt="background"
        src="/essential/chat-background.png"
        className={` w-full h-full absolute ${isLoading ? "z-[55]" : "z-0 "}`}
        priority
      />

      {children}

      {channel && (
        <ChatInput
          placeholder={`Message ${channel?.name ? ` #${channel?.name}` : ""}`}
          access={channel?.access}
          scrollToBottom={scrollToBottom}
          isAtBottonArea={isAtBottonArea}
        />
      )}
    </div>
  );
}
