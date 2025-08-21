import { useParams } from "next/navigation";
import React from "react";
import ChannelTasks from "../ChannelTasks";
import { useAppSelector } from "@/lib/hooks";

import ChannelStartDetails from "./ChannelStartDetails";
import { RootState } from "@/lib/store";

const ChatAreaHeader = () => {
  const { channelId } = useParams();

  const group = useAppSelector((state: RootState) => state.group.group);

  const hideChannelStartDetails = useAppSelector((state: RootState) => {
    const channel = state.group.group?.channels?.find(
      (item) =>
        item.id === channelId &&
        item?.privacy == "PUBLIC" &&
        item?.name === "general"
    );

    return !!channel;
  });

  const showTask = group?.channels?.find(
    (item) =>
      item.id === channelId &&
      item?.privacy == "PUBLIC" &&
      item?.name === "general" &&
      group?.roles?.includes("OWNER")
  );

  return (
    <>
      {hideChannelStartDetails ? (
        <div className=" px-2  max-tablet-lg:mt-10 w-full">
          <div className="text-center  max-w-[500px] mx-auto">
            <h3 className="text-[24px] font-semibold">
              Welcome to {group?.name}
            </h3>
            <span className="font-light text-[19px]">
              Connect, collaborate, and grow with others who share your passion.
            </span>
          </div>
        </div>
      ) : (
        <ChannelStartDetails />
      )}
      {showTask && <ChannelTasks />}
    </>
  );
};

export default ChatAreaHeader;
