"use client";

import { UserContext, UserContextType } from "@/contexts/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { useContextSelector } from "use-context-selector";

const ProfileNavigation = () => {
  const logout = useContextSelector(
    UserContext,
    (state: UserContextType) => state.logout
  );
  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  );

  const [isKycBannerVisible, setIsKycBannerVisible] = useState(true);
  const router = useRouter();

  const handleCloseKycBanner = () => {
    setIsKycBannerVisible(false);
  };
  return (
    <div className=" pb-[60px] pt-10 flex flex-col items-center tablet-lg::p-4">
     {/* KYC Banner */}
      {isKycBannerVisible && !currentUser?.isKyc && (
        <div className=" bg-gradient-to-r w-full from-primary shadow rounded-[11px] p-[1px] to-secondary/70 mb-6">
          <div className="w-full  bg-white rounded-[10px] p-4 flex justify-between items-center ">
            <span className="text-lg font-semibold text-center w-full text-gray-800">
              Complete your KYC
            </span>
            <button
              onClick={handleCloseKycBanner}
              className=" right-6 text-gray-500 hover:text-gray-800"
            >
              <IoCloseOutline className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Cards */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <button
          onClick={() => {
            router.push(`/settings/profile/basic`);
          }}
          className="bg-white rounded-xl p-4 py-5 flex justify-between items-center"
        >
          <span className="text-gray-800 font-medium">Public Profile</span>
          <IoIosArrowForward className="text-xl text-gray-400" />
        </button>
        <button
          onClick={() => {
            router.push(`/settings/kyc/general`);
          }}
          className="bg-white rounded-xl p-4 py-5 flex justify-between items-center"
        >
          <span className="text-gray-800 font-medium">Account KYC</span>
          <IoIosArrowForward className="text-xl text-gray-400" />
        </button>
        {/* <button
          onClick={() => {
            toast.error("...");
          }}
          className="bg-white rounded-xl p-4 py-5 flex justify-between items-center"
        >
          <span className="text-gray-800 font-medium">Preference</span>
          <IoIosArrowForward className="text-xl text-gray-400" />
        </button> */}

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="bg-red-600 text-white font-medium py-5 text-start px-4 rounded-xl mt-4 hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileNavigation;
