import { cn } from "@/lib/utils";
import React from "react";
const Loader = ({ channelId }: { channelId?: string | undefined }) => {
  return (
    <div
      className={cn(
        " right-0  max-tablet-lg:absolute z-[40] max-tablet-lg:top-0 w-full border-primary/50 border-b bg-white tablet-lg:bg-[#C3DBEC]  min-h-[60px] h-[60px] flex-col px-5  justify-center",
        !!channelId ? "flex" : "hidden tablet-lg:flex"
      )}
    />
  );
};
export default Loader;
