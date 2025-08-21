import React from "react";

const SkeletonLoader = ({
  hidden = false,
}: {
  isLoading?: boolean;
  hidden?: boolean;
}) => {
  return (
    <div
      className={` ${
        hidden ? " max-tablet-lg:hidden" : ""
      } w-full  tablet-lg:w-[250px]  mt-[1dvh] max-tablet-lg:h-[99dvh] flex flex-col border-primary/50 border-r rounded-tl-[40px] bg-white tablet-lg:bg-[#C3DBEC]`}
    >
      <div className=" flex flex-col  h-[99dvh] prevent-select "/>
    </div>
  );
};

export default SkeletonLoader;
