"use client";

import React from "react";
import CustomAvatar from "./custom/CustomAvatar";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import { TfiPlus } from "react-icons/tfi";
import NotificationsDropdown from "./dropdown/NotificationsDropdown";

const More = () => {
  return (
    <div className="bg-primary p-4 space-y-4 min-h-screen flex flex-col relative">
      <div className="flex items-center justify-between">
        <div className="text-white font-medium text-3xl">More</div>

        <div className="flex items-center gap-4">
          <button className="relative flex items-center justify-center text-white rounded-full bg-blue-500 h-[36px] w-[36px] ">
            {/* <IoNotificationsOutline size={28} /> */}
            <NotificationsDropdown />
            <span className="absolute top-[-4px] right-[-6px] bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-[14px] font-bold">
              14
            </span>
          </button>
          <div>
            <CustomAvatar
              image="/icon/samsonbeatrice.svg"
              className="justify-start w-[40px] h-[40px] shrink-0 rounded-full"
              imageClassName="h-[40px] object-top text-[16px] font-bold text-primary border w-[40px] rounded-full overflow-hidden flex items-center justify-center"
              labelClassName="h-[40px] border-none w-[40px] rounded-[9px] overflow-hidden flex items-center justify-center"
              alt="profile image"
              showText={false}
              iconClassName="w-[20px] h-[20px]"
              disabled={true}
            />
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Jump to or search"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[15px] rounded-tr-[15px] h-[85vh] tablet-lg:h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-6 max-w-screen-md mx-auto">
          <button className="flex items-start gap-4 text-left w-full">
            <div className="bg-primary rounded-md p-2">
              <Image
                src="/icon/ggroups.svg"
                alt="Group42"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-black font-inter">
                Groups
              </h1>
              <p className="text-sm text-gray-600 font-inter">
                Add a new group
              </p>
            </div>
          </button>

          <button className="flex items-start gap-4 text-left w-full">
            <div className="bg-primary rounded-md p-2">
              <Image
                src="/icon/savings.svg"
                alt="Savings"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-black font-inter">
                Savings
              </h1>
              <p className="text-sm text-gray-600 font-inter">
                Add new group savings
              </p>
            </div>
          </button>

          <button className="flex items-start gap-4 text-left w-full">
            <div className="bg-primary rounded-md p-2">
              <Image
                src="/icon/clubs.svg"
                alt="Club"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-black font-inter">
                Club
              </h1>
              <p className="text-sm text-gray-600 font-inter">
                Create a new club
              </p>
            </div>
          </button>

          <button className="flex items-start gap-4 text-left w-full">
            <div className="bg-primary rounded-md p-2">
              <Image
                src="/icon/crowdfund.svg"
                alt="Crowdfund"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-black font-inter">
                Crowd Fund
              </h1>
              <p className="text-sm text-gray-600 font-inter">
                Start a new crowd fund
              </p>
            </div>
          </button>
        </div>
        <div className="fixed bottom-24 right-6 z-50 ">
          <button className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition duration-300">
            <TfiPlus size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default More;
