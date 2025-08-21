"use client";

import { usePathname } from "next/navigation";
import React from "react";
const Loading = () => {
  const pathname = usePathname();

  if (pathname.includes(`/join/`)) return;

  const isClosed =
    pathname.includes("/groups") || pathname.includes("/settings") || pathname.includes("/bf/");

  return (
    <>
      <div
        className={`tablet-lg:flex-none prevent-select tablet-lg:flex   hidden justify-center  bg-primary h-full relative ${
          isClosed ? "w-[80px]" : "w-[250px]"
        }  overflow-auto`}
      >
        <div className="w-[80%]  flex flex-col h-full">
          <div className={`h-auto mx-auto w-[60px] mt-[100px] mb-[40px]`}>
            <div className="w-full aspect-square bg-[#65A2CD]/40 rounded-[10px] " />
          </div>
          <div className="w-full h-[42px] rounded-[10px] bg-[#65A2CD]/40  mt-[10px] mb-[10px]"></div>
          <div className="w-full h-[42px] rounded-[10px] bg-[#65A2CD]/40  mb-[10px]"></div>
          <div className="w-full h-[42px] rounded-[10px] bg-[#65A2CD]/40  mb-[10px]"></div>
          <div className="w-full h-[42px] rounded-[10px] bg-[#65A2CD]/40  mb-[10px]"></div>
        </div>
      </div>
    </>
  );
};
export default Loading;
