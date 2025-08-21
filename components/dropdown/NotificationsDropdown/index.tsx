"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { RiExpandDiagonalLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchGeneralUnreadNotificationsCount,
  fetchReceiverInviteCount,
  fetchReceiverRequestCount,
} from "@/lib/features/notification/generalNotificationSlice";
import { RootState } from "@/lib/store";
import TabButton from "./components/TabButton";
import AllNotifications from "@/components/notification/sections/AllNotifications";
import MentionNotification from "@/components/notification/sections/MentionNotification";
import InvitesNotification from "@/components/notification/sections/InvitesNotification";
import RequestsNotification from "@/components/notification/sections/RequestsNotification";

const NotificationsDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const dispatch = useAppDispatch();

  const {
    unreadCount,
    unreadCounts,
    pendingRequestsCount,
    pendingInvitesCount,
  } = useAppSelector((state: RootState) => {
    return {
      unreadCount: state.generalNotifications.unreadCount?.total,
      unreadCounts: state.generalNotifications.unreadCount?.counts,
      pendingRequestsCount: state.generalNotifications?.pendingRequestsCount,
      pendingInvitesCount: state.generalNotifications?.pendingInvitesCount,
    };
  });

  const tabData = {
    All: { count: unreadCount },
    Mentions: { count: unreadCounts?.mention || 0 },
    Invites: { count: pendingInvitesCount },
    Requests: { count: pendingRequestsCount },
  };

  useEffect(() => {
    dispatch(fetchGeneralUnreadNotificationsCount());
    dispatch(fetchReceiverInviteCount({ status: "PENDING" }));
    dispatch(fetchReceiverRequestCount({ status: "PENDING" }));
  }, [dispatch]);

  return (
    <>
      <button
        onClick={() => router.push("/notification")}
        className="relative flex items-center justify-center text-white rounded-full bg-primary h-[36px] w-[36px] tablet-lg:hidden"
      >
        <IoNotificationsOutline size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-[-4px] right-[-6px] bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-[14px] font-bold">
            {unreadCount + pendingRequestsCount + pendingInvitesCount}
          </span>
        )}
      </button>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className=" max-tablet-lg:hidden ">
          <button className="relative flex items-center justify-center text-white rounded-full bg-primary h-[36px] w-[36px]">
            <IoNotificationsOutline size={28} />
            {unreadCount > 0 && (
              <span className="absolute top-[-4px] right-[-6px] bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-[14px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="tablet-lg:max-w-[580px] max-tablet-lg:!hidden max-tablet-lg:w-full tablet-lg:w-[580px]  bg-white shadow tablet-lg:-translate-x-16  tablet-lg:translate-y-10"
        >
          <div className="p-6">
            <div className="px-3 py-2 text-[16px] font-semibold text-[#000000] mb-4 flex justify-between items-center">
              <span>NOTIFICATIONS</span>
              <div className="flex items-center gap-2">
                <RiExpandDiagonalLine size={14} />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-0 m-0 bg-transparent border-none cursor-pointer"
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>

            <div className="relative w-full border-b-2 border-gray-300">
              <div className="px-3 flex justify-start gap-6">
                {Object.entries(tabData).map(([tab, { count }]) => (
                  <TabButton
                    key={tab}
                    tab={tab}
                    selectedTab={selectedTab}
                    count={count}
                    onClick={() => setSelectedTab(tab)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className=" flex  h-[400px]  flex-col  gap-2 flex-1 overflow-y-auto ">
            {/*ALL TAB*/}

            {selectedTab === "All" && isOpen && <AllNotifications />}

            {/*MENTIONS TAB*/}

            {selectedTab === "Mentions" && <MentionNotification />}

            {selectedTab === "Invites" && <InvitesNotification />}

            {selectedTab === "Requests" && <RequestsNotification />}
          </div>
          <div className="bottom-0 left-0 w-full bg-white shadow-md">
            <button
              className="w-[calc(100%+48px)] -mx-6 bg-[#CBD5E1]/25 text-black text-center py-2 rounded-md font-semibold"
              onClick={() => router.push("/notification")}
            >
              View All
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NotificationsDropdown;
