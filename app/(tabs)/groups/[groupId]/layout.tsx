"use client";

// PROJECT IMPORTS

import ChannelLoader from "@/components/channel/channelList/loader";
import dynamic from "next/dynamic";
import { useParams, usePathname } from "next/navigation";

const ChannelList = dynamic(() => import("@/components/channel/channelList"), {
  ssr: false,
  loading: () => <ChannelLoader />,
});

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const { groupId, channelId } = useParams();

  const hidden =
    !!groupId && !!channelId ? true : false || !pathName.includes("groups");

  return (
    <>
      <div
        className={`flex items-start w-full ${
          hidden ? " tablet-lg:bg-[#88B7D8]" : "bg-[#88B7D8]"
        } `}
      >
        <ChannelList />
        {children}
      </div>
    </>
  );
}
