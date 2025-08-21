import { useQuery } from "@tanstack/react-query";
import { getRecommendedGroups } from "@/api/group";
import GroupRecommendedCardLoader from "@/components/cards/GroupRecommendedCard/loading";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { UserContext } from "@/contexts/user";
import { useContextSelector } from "use-context-selector";
import Image from "next/image";
import { RiSearchLine } from "react-icons/ri";
// import { TfiPlus } from "react-icons/tfi";
const RecommendedCard = dynamic(
  () => import("@/components/cards/GroupRecommendedCard"),
  {
    ssr: false,
    loading: () => <GroupRecommendedCardLoader />,
  }
);
const GroupRecommendations = ({
  filters,
  query,
}: {
  filters: {
    [key: string]: any;
  };
  query: string | undefined;
  setFilters: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;
}) => {
  const groupOnlineUsers = useSelector(
    (state: RootState) => state.socket.groupOnlineUsers
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [search, setSearch] = useState("");
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );
  const { data, isLoading } = useQuery({
    queryKey: [
      `recommended-groups-${currentUser?.id}`,
      {
        ...filters,
        ...(query && { query }),
      },
    ],
    queryFn: () =>
      getRecommendedGroups({
        ...filters,
        ...(query && { query }),
      }),
  });
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  return (
    <div className=" w-full">
      {!isLoading && data?.data.groups.length === 0 ? (
        <div className="col-span-3 text-center mt-5 tablet:mt-10">
          <p>
            There are currently no groups in this category.{" "}
            <button className="  font-semibold  text-primary">
              Create group
            </button>
          </p>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between">
          {/* Heading (always visible) */}
          <h3 className="text-[18px] tablet:text-[24px] font-semibold text-black pb-4">
            Recommended
          </h3>
          {/* Menu + Search icons (only on tablet-lg and below) */}
          <div
            className="hidden max-tablet-lg:flex items-center gap-3 mb-4"
            ref={dropdownRef}
          >
            <div className="cursor-pointer" onClick={() => setOpen(!open)}>
              <Image
                src="/icon/menu.svg"
                alt="menu"
                width={15}
                height={15}
                className="mr-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <RiSearchLine
                size={18}
                className="text-black cursor-pointer"
                onClick={() => setSearchActive(!searchActive)}
              />
              {searchActive && (
                <input
                  type="text"
                  placeholder=""
                  className="w-[150px] px-2 py-[2px] text-sm border border-gray-300 rounded outline-none transition-all duration-200"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {/* <TfiPlus /> */}
      <div className=" relative grid grid-cols-2 desktop:grid-cols-3 gap-2 w-full tablet:gap-4 justify-center ">
        {data?.data.groups.map((item, index) => {
          return (
            <RecommendedCard
              isLoading={isLoading}
              {...item}
              key={index}
              onlineUserCount={
                Object?.keys(groupOnlineUsers?.[item.id] || {}).length
              }
            />
          );
        })}
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <GroupRecommendedCardLoader key={index} />
          ))}
      </div>
    </div>
  );
};
export default GroupRecommendations;
