"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
const Loader = () => {
  const pathName = usePathname();
  const { groupId, channelId } = useParams();

  const hidden =
    !!groupId && !!channelId ? true : false || !pathName.includes("groups");

  if (pathName.includes(`/join/`)) return;

  return (
    <>
      {pathName === "/chats" || pathName.includes("/chats") ? (
        <div className="!w-[400px] tablet-lg:block hidden justify-center bg-[#88B7D8] h-screen flex-none">
          <div className="w-full h-full px-[30px] pt-[50px]">
            <div className="w-full inline-flex items-center justify-between text-[20px] relative prevent-select">
              <div className="w-full h-[30px] rounded-[10px] bg-primary/40 " />
            </div>
            <div className="w-[50px] aspect-square rounded-full bg-primary/40 mt-[20px] " />
            <div className="w-full h-[40px] rounded-[10px] bg-primary/40 mt-[50px] " />
            <div className="w-full h-[40px] rounded-full bg-primary/40 mt-[20px] " />
            <div className="w-[150px] h-[40px] rounded-full bg-primary/40 mt-[20px] " />
            <div className="w-full h-[50px] rounded-[10px] bg-primary/40 mt-[20px] " />
            <div className="w-full h-[50px] rounded-[10px] bg-primary/40 mt-[20px] " />
            <div className="w-full h-[50px] rounded-[10px] bg-primary/40 mt-[20px] " />
            <div className="w-full h-[50px] rounded-[10px] bg-primary/40 mt-[20px] " />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "w-[65px] tablet:min-w-[80px] tablet:w-[80px]",
            "h-screen max-tablet-lg:h-[100dvh]",
            "z-[22] sticky top-0 justify-center overflow-y-auto pb-4 scrollbar-hide bg-[#88B7D8]",
            hidden ? "hidden tablet-lg:block" : "tablet-lg:block"
          )}
        >
          <div className="`w-full px-1 flex relative items-center justify-center mt-[10px] tablet:mt-[17px]  hover:opacity-70">
            <div className="w-[45px] h-[45px] mt-[60px] rounded-[12px] bg-primary/40 "></div>
          </div>
          <div className="w-full flex items-center justify-center mt-[17px]">
            <div className="w-[45px] h-[45px] rounded-[17px] bg-primary/40 "></div>
          </div>
          <div className="w-full flex items-center justify-center mt-[17px]">
            <div className="w-[45px] h-[45px] rounded-[17px] bg-primary/40 "></div>
          </div>
          <div className="w-full flex items-center justify-center mt-[17px]">
            <div className="w-[45px] h-[45px] rounded-[17px] bg-primary/40 "></div>
          </div>
          <div className="w-full flex items-center justify-center mt-[17px]">
            <div className="w-[45px] h-[45px] rounded-[17px] bg-primary/40 "></div>
          </div>
          <div className="w-full flex items-center justify-center mt-[17px]">
            <div className="w-[45px] h-[45px] rounded-[17px] bg-primary/40 "></div>
          </div>
        </div>
      )}
    </>
  );
};
export default Loader;
