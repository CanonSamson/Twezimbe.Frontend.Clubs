"use client";

import ChannlHeaderLoader from "@/components/channel/channelHeader/loader";
// import SkeletonLoader from "@/components/channel/channelList/loader";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";

const Loading = () => {
  const pathName = usePathname();
  const { groupId, channelId } = useParams();

  const hidden =
    !!groupId && !!channelId ? true : false || !pathName.includes("groups");

  return (
    <div
      className={`flex items-end  justify-end w-full ${
        hidden ? " tablet-lg:bg-[#88B7D8]" : "bg-[#88B7D8]"
      }  `}
    >
      {/* <SkeletonLoader isLoading={true} hidden={false} /> */}
      <div className="flex overflow-hidden mb-auto max-tablet-lg:bg-white  h-[100dvh] tablet-lg:mt-[1vh]  flex-col w-full relative    tablet-lg:h-[99vh] ">
        <ChannlHeaderLoader />
        <div
          className={` h-[calc(99dvh-64px)]  tablet-lg:flex-1 relative  bg-gray-50`}
        >
          <Image
            width={400}
            height={400}
            alt="background"
            src="/essential/chat-background.png"
            className=" z-0 w-full h-full absolute"
          />
          <div className="flex-1 relative  pt-24 font-inter py-6 z-20 px-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
