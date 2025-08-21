// components/ChannelList.js
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { LuCalendarDays } from "react-icons/lu";
// import { LiaUserPlusSolid } from "react-icons/lia";
import {
  IoCashOutline,
  IoLogOutOutline,
  IoClose,
  IoChevronDownOutline,
} from "react-icons/io5";
// import { FiUsers } from "react-icons/fi";
import { useState } from "react";
import { FaAnglesUp } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { useAppSelector } from "@/lib/hooks";
import { useSettingModal } from "@/contexts/modal-setting";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "@/contexts/user";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import GroupCrowdIcon from "../../../public/assets/crowd-funding/icons/crowd-group-icon.svg";
import Image from "next/image";

const GroupDropDown = ({
  createBf,
}: {
  canInvite: boolean;
  createBf: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const group = useAppSelector((state) => state.group.group);

  // const channelId = useParams()?.channelId as string;
  // const channel = group?.channels?.find((item) => item.id === channelId);
  // const access = channel?.access;

  // console.log(access)
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );

  const { toggleModal } = useSettingModal();

  const router = useRouter();
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="h-[60px] w-full  text-start ring-0  border-none  focus:outline-none"
        onBlur={() => {}}
        asChild
      >
        <button className="font-medium text-primary flex relative items-center justify-between">
          <span className="absolute top-0 right-0 w-full h-full z-20"></span>
          <div className=" flex items-center gap-2">
            <span className="line-clamp-1 text-black tablet:text-primary">
              {group?.name}
            </span>
            <MdOutlineKeyboardArrowRight className=" text-black size-[24px] tablet-lg:hidden" />
          </div>
          <div className="max-tablet:hidden">
            {isOpen ? (
              <IoClose size={20} />
            ) : (
              <IoChevronDownOutline size={20} />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={"start"}
        className="  px-0 bg-white  w-full min-w-56 py-2"
      >
        {/* {canInvite && access && channel?.privacy === "PRIVATE" && (
          <>
            <DropdownMenuItem className=" p-1">
              <div className=" flex items-center  gap-2 hover:bg-gray-50 duration-100 transition-all  w-full p-2 rounded-[5px]">
                <LiaUserPlusSolid size={20} />
                <span>Join requests</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className=" bg-gray-200 mx-2 " />
          </>
        )} */}
        {/* <DropdownMenuSeparator className=' bg-gray-200 ' /> */}
        <DropdownMenuItem className=" p-1">
          <div className=" flex items-center  gap-2 hover:bg-gray-50 duration-100 transition-all  w-full p-2 rounded-[5px]">
            <LuCalendarDays size={20} />
            <span>Events</span>
          </div>
        </DropdownMenuItem>

        {createBf && (
          <DropdownMenuItem
            onClick={() => {
              if (currentUser?.isKyc) {
                router.push(`/bf/${group?.id}/create`);
              } else {
                toggleModal("bfKycRequiredModal");
              }
            }}
            className=" p-1"
          >
            <div className=" flex items-center  gap-2 hover:bg-gray-50 duration-100 transition-all  w-full p-2 rounded-[5px]">
              <IoCashOutline size={20} />
              <span>Benevolent Funds</span>
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            router.push(`/crowd-funding/campaigns`);
          }}
          className=" p-1"
        >
          <div className=" flex items-center  gap-2 hover:bg-gray-50 duration-100 transition-all  w-full p-2 rounded-[5px] cursor-pointer">
            <Image
              src={GroupCrowdIcon}
              alt="Crowd Funding"
              className="size-5"
            />
            <span>Crowdfunding</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className=" p-1">
          <div className=" flex items-center  gap-2 hover:bg-gray-50 duration-100 transition-all  w-full p-2 rounded-[5px]">
            <FaAnglesUp size={20} />
            <span>Upgrade plan</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            toggleModal("groupDetailsModal", {
              activeTab: "settings",
              isGroupSettings: true,
            })
          }
          className=" p-1"
        >
          <div className=" flex items-center  gap-2 hover:bg-gray-50 duration-100 transition-all  w-full p-2 rounded-[5px]">
            <FiSettings size={20} />
            <span>Group settings</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toggleModal("leaveGroupModal", { step: 2 })}
          className=" p-1 text-negative"
        >
          <div className=" flex items-center  gap-2 hover:bg-gray-50 duration-100 transition-all  w-full p-2 rounded-[5px]">
            <IoLogOutOutline size={20} />

            <span>Leave group</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupDropDown;
