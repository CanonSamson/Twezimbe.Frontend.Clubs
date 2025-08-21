"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserGroupListType } from "@/types/groups";
import { cn } from "@/lib/utils";
import HomeIcon from "@/public/icon/HomeIcon";
import CommunityIcon from "@/public/icon/CommunityIcon";
import ChatsIcon from "@/public/icon/ChatsIcon";
// import FriendsIcon from "@/public/icon/FriendsIcon";
import WalletIcon from "@/public/icon/WalletIcon";
import MoreIcon from "@/public/icon/MoreIcon";

interface RenderLinkItemProps {
  _url: string;
  _name: string;
  _icon: string;
  _clickedIcon: string;
  pathname: string;
  siderWidth?: number;
  groupList?: UserGroupListType[];
  icon?: ReactNode;
  handleClick?: () => void;
}

const RenderLinkItem: React.FC<RenderLinkItemProps> = ({
  _url,
  _name,
  _icon,
  pathname,
  siderWidth = 80,
  groupList,
  icon,

  handleClick,
}) => {
  const router = useRouter();

  const handleNavigate = (_url: string) => {
    if (handleClick) return handleClick();
    // Check if running on the client (window is available)
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      console.log("Screen width:", screenWidth);

      if (_url === "/groups" && groupList?.length) {
        const firstGroup = groupList[0];

        // Example: conditional navigation based on screen width
        if (screenWidth < 767) {
          // Mobile-specific logic (optional)
          console.log("Navigating on mobile");
          router.push(`/groups/${firstGroup.id}`);

          return;
        }

        const firstChannel = firstGroup.channels[0];
        router.push(`/groups/${firstGroup.id}/${firstChannel.id}`);
      } else {
        router.push(_url);
      }
    }
  };

  const isActive =
    (_url === "/home" && _url === pathname) ||
    (_url !== "/home" &&
      (pathname.includes(_url) ||
        (_name === "Groups" &&
          (/^\/bf\/[^/]+\/create$/.test(pathname) ||
            /^\/bf\/file-case\/[^/]+\/[^/]+$/.test(pathname)))));

  return (
    <div className="tablet-lg:w-full max-tablet-lg:h-[70px] max-tablet-lg:flex-1 flex items-center justify-center">
      <li
        onClick={() => handleNavigate(_url)}
        className={cn(
          "relative max-tablet-lg:flex-col flex max-tablet-lg:items-center  max-tablet-lg:justify-center tablet-lg:mb-[10px] duration-500 transition-all tablet-lg:py-3 tablet-lg: focus:bg-[#65A2CD]/40 text-primary tablet-lg:text-white hover:border-[#F7F9FC] tablet-lg:hover:bg-[#65A2CD]/40 cursor-pointer text-sm tablet-lg:rounded-[10px]",
          siderWidth < 240
            ? "tablet-lg:justify-center tablet-lg:w-[40px]"
            : "tablet-lg:px-5 tablet-lg:w-full",
          isActive && " tablet-lg:bg-[#65A2CD]/40"
        )}
      >
        {icon ? (
          icon
        ) : (
          <div
            className={cn(
              siderWidth > 240 && "tablet-lg:mr-[15px]",
              "max-tablet-lg:h-[30px] tablet-lg:h-auto flex items-center justify-center px-1 rounded-[7px] overflow-hidden",
              isActive ? "max-tablet-lg:bg-primary" : " tablet-lg:text-white"
            )}
          >
            {_name === "Home" ? (
              <>
                <HomeIcon
                  className={cn(
                    "h-auto tablet-lg:hidden",
                    "max-tablet-lg:w-[24px]",
                    ""
                  )}
                  stroke={!isActive ? "#1170B2" : "white"}
                />
                <HomeIcon
                  className={cn(
                    "h-auto hidden tablet-lg:flex",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={"white"}
                />
              </>
            ) : _name === "Groups" ? (
              <>
                <CommunityIcon
                  className={cn(
                    "h-auto tablet-lg:hidden",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={!isActive ? "#1170B2" : "white"}
                />
                <CommunityIcon
                  className={cn(
                    "h-auto hidden tablet-lg:flex",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={"white"}
                />
              </>
            ) : _name === "Direct" ? (
              <>
                <ChatsIcon
                  className={cn(
                    "h-auto tablet-lg:hidden",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={!isActive ? "#1170B2" : "white"}
                />
                <ChatsIcon
                  className={cn(
                    "h-auto hidden tablet-lg:flex",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={"white"}
                />
              </>
            ) : _name === "Wallet" ? (
              <>
                <WalletIcon
                  className={cn(
                    "h-auto tablet-lg:hidden",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={!isActive ? "#1170B2" : "white"}
                />
                <WalletIcon
                  className={cn(
                    "h-auto hidden tablet-lg:flex",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={"white"}
                />
              </>
            ) : _name === "More" ? (
              <>
                <MoreIcon
                  className={cn(
                    "h-auto tablet-lg:hidden",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={!isActive ? "#1170B2" : "white"}
                />
                <MoreIcon
                  className={cn(
                    "h-auto hidden tablet-lg:flex",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  stroke={"white"}
                />
              </>
            ) : (
              <>
                <Image
                  src={_icon}
                  height={0}
                  width={0}
                  alt=""
                  className={cn(
                    "h-auto",
                    "max-tablet-lg:w-[24px]",
                    isActive ? "tablet-lg:w-[20px]" : "tablet-lg:w-[18px]",
                    ""
                  )}
                  priority={isActive}
                />
              </>
            )}
          </div>
        )}

        <span
          className={cn(
            "",
            siderWidth > 240
              ? "flex"
              : "tablet-lg:hidden mt-[2px] tablet-lg:mt-auto"
          )}
        >
          {_name}
        </span>
      </li>
    </div>
  );
};

export default RenderLinkItem;
