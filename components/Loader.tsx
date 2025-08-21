// ==============================|| Loader ||============================== //

import React from "react";
import Image from "next/image";
const Loading = () => {
  return (
    <div
      className={`w-full h-[100dvh] items-center flex justify-center font-ttfirs bg-white text-primary`}
    >
      <div className="flex-row w-auto justify-center">
        <Image
          src={"/essential/icon.svg"}
          alt={"refresh"}
          width={100}
          height={100}
          priority
          className="w-[75px] h-auto"
        />
        <div className={`mt-[20px] text-[14px] font-ttfirs`}>Opening ...</div>
      </div>
    </div>
  );
};
export default Loading;
