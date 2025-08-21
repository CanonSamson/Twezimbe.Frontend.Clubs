"use client";

import useGroup from "@/hooks/userGroup";
import ChannelHeader from "./channelHeader";
import ChatArea from "./chatArea";

export default function ChannelComponent() {
  const { hasAccess } = useGroup();

  if (!hasAccess) {
    return (
      <div className="flex flex-1 h-full  bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            You are not a member of this group
          </h1>
          <p className="text-gray-500">
            You can&apos;t access this group or channel.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex overflow-hidden max-tablet-lg:bg-white h-[100dvh] flex-col w-full relative tablet-lg:mt-auto tablet-lg:h-[99vh] z-20">
      <ChannelHeader />
      <ChatArea />
    </div>
  );
}
