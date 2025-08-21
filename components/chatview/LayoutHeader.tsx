"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import MembersIcon from "@/public/icon/MembersIcon";
import SettingsIcon from "@/public/icon/SettingsIcon";
import CustomAvatar from "../custom/CustomAvatar";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import RequestsIcon from "@/public/icon/RequestsIcon";

const LayoutHeader = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const groupId = params.groupId as string;
  const channelId = params.channelId as string;
  const pathname = usePathname();
  const group = useAppSelector((state: RootState) => state.group.group);
  const isChannelAdmin = useAppSelector((state: RootState) => {
    const group = state.group.groups?.[groupId];
    const channel = group?.channels?.find((c) => c.id === channelId);
    return (
      channel?.role?.some((role) => role.permissions.includes("ADMIN")) || false
    );
  });

  const router = useRouter();
  const chatItems = [
    {
      key: "about",
      label: "About",
      icon: () => (
        <div className={`rounded-full p-0 `}>
          <CustomAvatar
            image={group?.iconImage || undefined}
            userFullName={group?.name}
            imageClassName="h-full w-full bg-white object-cover text-[30px] mobile:text-[40px] font-black w-[70px] mobile:w-[70px] h-[70px] mobile:h-[70px] border text-primary flex items-center justify-center text-center"
            iconClassName="text-white size-4 mobile:size-5"
            alt="posing"
            className="h-20 w-20"
            disabled={true}
          />
        </div>
      ),
      href: `/groups/${groupId}/${channelId}/details/about`,
    },

    {
      key: "members",
      label: "Members",
      icon: ({ isActive }: { isActive: boolean }) => (
        <MembersIcon
          bgColor={isActive ? "#1170B2" : "#CBD5E1"}
          iconColor={isActive ? "white" : "#1170B2"}
          className="h-16 w-16"
        />
      ),
      href: `/groups/${groupId}/${channelId}/details/members`,
    },
    ...(isChannelAdmin
      ? [
          {
            key: "requests",
            label: "requests",
            icon: ({ isActive }: { isActive: boolean }) => (
              <div className="flex items-center justify-center h-16 w-16">
                <RequestsIcon
                  bgColor={isActive ? "#1170B2" : "#CBD5E1"}
                  iconColor={isActive ? "white" : "#1170B2"}
                  className="h-full w-full"
                />
              </div>
            ),
            request: 0,
            href: `/groups/${groupId}/${channelId}/details/requests`,
          },
        ]
      : []),

    {
      key: "settings",
      label: "Settings",
      icon: ({ isActive }: { isActive: boolean }) => (
        <SettingsIcon
          bgColor={isActive ? "#1170B2" : "#CBD5E1"}
          iconColor={isActive ? "white" : "#1170B2"}
          className="h-16 w-16"
        />
      ),
      href: `/groups/${groupId}/${channelId}/details/settings`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 w-full overflow-x-hidden">
      <header className="bg-gray-100 text-black p-4">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <button
            onClick={() => router.push(`/groups/${groupId}/${channelId}`)}
            className="bg-gray-200 rounded-full p-1 flex items-center justify-center"
          >
            <IoIosArrowRoundBack className="h-6 w-6" />
          </button>
          <span className="text-[20px]">#</span>
          <span className="font-inter text-[16px]">general</span>
        </div>
      </header>

      <div className="w-screen relative left-1/2 -translate-x-1/2 border-t border-b border-gray-300">
        <div className="max-w-7xl mx-auto w-full px-2 mobile:px-4 tablet:px-6">
          <div className="flex justify-center items-center space-x-2 mobile:space-x-2 tablet:space-x-4 tablet-lg:-space-x-60 laptop:-space-x-44 desktop:space-x-4 py-1 mobile:py-2 tablet:py-3">
            {chatItems.map((item) => {
              const { key, label, href, icon: Icon, request } = item;
              const isActive = pathname === href;

              return (
                <Link href={href} key={key} className="shrink-0 flex-1">
                  <div className="flex flex-col items-center cursor-pointer">
                    <div
                      className={
                        `${key === "requests" ? "relative" : ""} ` +
                        `h-16 w-16 tablet:h-16 tablet:w-16 tablet-lg:h-16 tablet-lg:w-16`
                      }
                    >
                      <Icon isActive={isActive} />
                      {key === "requests" && request && request > 0 ? (
                        <span className="absolute bottom-1 right-1 translate-x-1/4 translate-y-1/4 bg-orange-500 text-white rounded-full w-4 h-4 tablet:w-5 tablet:h-5 flex items-center justify-center font-inter text-[8px] tablet:text-xs">
                          {request}
                        </span>
                      ) : null}
                    </div>
                    <span
                      className={`
                    text-[10px] mobile:text-[12px] tablet:text-[14px]
                    font-inter mb-1
                    ${key === "about" ? "mt-2 ml-4 tablet:mt-2" : "mt-1 "}
                    ${isActive ? "text-primary" : "text-black"}
                  `}
                    >
                      {label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-grow overflow-y-auto p-4 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default LayoutHeader;
