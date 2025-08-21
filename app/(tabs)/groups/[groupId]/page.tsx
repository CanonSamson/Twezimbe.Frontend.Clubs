"use client";
import Image from "next/image";

const GroupPage = () => {
  return (
    <div className=" w-full max-tablet-lg:hidden bg-white overflow-hidden h-[100dvh] ">
      <Image
        width={400}
        height={400}
        alt="background"
        src="/essential/chat-background.png"
        className={` max-tablet-lg:hidden w-full h-full  z-30  top-0 right-0`}
        priority
      />
    </div>
  );
};

export default GroupPage;
