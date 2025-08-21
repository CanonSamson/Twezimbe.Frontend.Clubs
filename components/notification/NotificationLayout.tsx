"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import {
  fetchGeneralUnreadNotificationsCount,
  fetchReceiverInviteCount,
  fetchReceiverRequestCount,
} from "@/lib/features/notification/generalNotificationSlice";
import TabButton from "../dropdown/NotificationsDropdown/components/TabButton";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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
  const router = useRouter();

  const tabData = {
    All: {
      count: unreadCount,
      name: "all",
      title: "All",
      path: "/notification",
    },
    Mentions: {
      count: unreadCounts?.mention || 0,
      name: "mentions",
      title: "Mentions",
      path: "/notification/mentions",
    },
    Invites: {
      count: pendingInvitesCount,
      name: "invites",
      title: "Invites",
      path: "/notification/invites",
    },
    Requests: {
      count: pendingRequestsCount,
      name: "requests",
      title: "Requests",
      path: "/notification/requests",
    },
  };

  useEffect(() => {
    dispatch(fetchGeneralUnreadNotificationsCount());
    dispatch(fetchReceiverInviteCount({ status: "PENDING" }));
    dispatch(fetchReceiverRequestCount({ status: "PENDING" }));
  }, [dispatch]);

  return (
    <div className="flex flex-col h-[100dvh]  ">
      <header className="bg-gray-50 px-4 tablet:px-12 pt-12 pb-2 sticky top-0 z-10 ">
        <div className="flex items-center justify-between mb-8 max-tablet:hidden">
          <h1 className="text-[#1170B2] font-bold text-2xl">Notifications</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#F2F2F2] rounded-[2px] h-[40px] px-4 gap-8 w-72">
              <Image src="/icon/seof.svg" alt="search" width={24} height={24} />
              <input
                type="text"
                placeholder="Search notifications"
                className="flex-1 bg-transparent focus:outline-none text-base"
              />
            </div>
            <IoMdClose size={24} />
          </div>
        </div>

        <div className="tablet:hidden ">
          <div className="flex items-center mb-4 px-0 min-w-0 ">
            <button
              onClick={() => router.push("/")}
              className="mr-2 p-1 text-[#000000] rounded shrink-0"
            >
              <IoIosArrowRoundBack className="text-3xl xs:text-4xl text-gray-700" />
            </button>
            <h1 className="text-black font-bold text-xl xs:text-2xl truncate">
              Notifications
            </h1>
          </div>
          <div className="flex items-center gap-2 xs:gap-4 flex-nowrap mb-4 px-0 min-w-0">
            <div className="flex items-center bg-[#F2F2F2] rounded-[2px] h-[36px] xs:h-[40px] px-3 xs:px-4 gap-3 xs:gap-4 flex-1 min-w-0">
              <Image
                src="/icon/seof.svg"
                alt="search"
                width={20}
                height={20}
                className="min-w-[20px] xs:min-w-[24px] xs:w-[24px] xs:h-[24px]"
              />
              <input
                type="text"
                placeholder="Search notifications"
                className="flex-1 bg-transparent focus:outline-none text-sm xs:text-base text-black min-w-0 xs:min-w-[120px] truncate placeholder:truncate"
              />
            </div>
            <div className="flex items-center gap-1 xs:gap-2 shrink-0">
              <h2 className="underline text-[#1170B2] font-medium text-sm xs:text-base whitespace-nowrap">
                Mark all as read
              </h2>
              <Image
                src="/icon/setting.svg"
                alt="actions"
                width={12}
                height={12}
                className="xs:w-[14px] xs:h-[14px]"
              />
            </div>
          </div>
        </div>

        <div className="relative ">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-400 -mx-4 tablet:mx-0" />
          <nav className="flex gap-0 w-full max-w-full flex-nowrap justify-center tablet:justify-start tablet:gap-6 relative overflow-hidden">
            {Object.entries(tabData).map(([tab, { count, path, name }]) => {
              const selectedTab = pathname.includes(path) && name !== "all";
              return (
                <div key={tab} className="tablet:flex-none flex-1 text-center">
                  <TabButton
                    tab={tab}
                    selectedTab={pathname}
                    selected={
                      name === "all"
                        ? pathname === "/notification"
                        : !!selectedTab
                    }
                    count={count}
                    onClick={() => router.push(path)}
                    className="w-full"
                  />
                </div>
              );
            })}

            <div className="flex items-center ml-auto gap-2 max-tablet:hidden">
              <h2 className="underline text-[#1170B2] font-medium">
                Mark all as read
              </h2>
              <Image
                src="/icon/setting.svg"
                alt="actions"
                width={14}
                height={14}
              />
            </div>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
