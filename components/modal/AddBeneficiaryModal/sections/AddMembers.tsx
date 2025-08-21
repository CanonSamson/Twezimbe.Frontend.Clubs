"use client";

import React, { useState, useEffect } from "react";
import { useSettingModal } from "@/contexts/modal-setting";
import { useUser } from "@/contexts/user";
import UserProfileHint from "@/components/UserProfileHint";
import { CiCirclePlus } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { useQuery } from "@tanstack/react-query";
import { getPotentialUserBeneficiaries } from "@/api/bereavement-fund/beneficiary";
import { useParams } from "next/navigation";

const AddMembers = () => {
  const { updateModalData, modals } = useSettingModal();
  const { currentUser } = useUser({});
  const {  groupId } = useParams();
  const bfId = useParams()?.bfId as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  const userProfile = {
    id: currentUser?.id ?? "",
    firstName: currentUser?.profile?.firstName ?? "",
    lastName: currentUser?.profile?.lastName ?? "",
    profileImage: currentUser?.profile?.profileImage ?? undefined,
    userName: currentUser?.profile?.userName ?? undefined,
  };

  const { data: potentialBeneficiary } = useQuery({
    queryKey: [
      "getPotentialUserBeneficiaries",
      bfId ,
      groupId as string,
      debouncedSearch,
    ],
    queryFn: () =>
      getPotentialUserBeneficiaries(bfId , groupId as string, {
        search: debouncedSearch,
        page: 1,
        limit: 10,
      }),
    enabled: Boolean(bfId && groupId && modals?.addBeneficiaryModal),
  });

  return (
    <>
      <div className="text-center mt-5 w-full max-w-full tablet-lg:w-[500px]">
        <div className="flex max-tablet-lg:justify-center tablet-lg:justify-between items-center mb-4">
          <h2 className="text-xl font-black text-[24px] text-[#1D1C1D]">
            Add beneficiary
          </h2>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <div className="relative  w-full">
          <input
            type="text"
            placeholder="Search beneficiaries"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="font-semibold text-[13px] w-full px-6 py-3 text-lg text-black bg-primary rounded-sm border border-primary focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-white placeholder:text-sm placeholder:font-normal"
          />
          <button className="absolute inset-y-0 right-3 flex items-center">
            <CiSearch className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
      <div className="border-t border-[#1D1C1D21] -mx-5  tablet-lg:hidden mt-4"></div>
      <div className="flex relative w-full right-3 mt-4">
        <button
          className="justify-start h-8 flex items-center gap-x-2 px-3 py-2 text-gray-600 transition-colors rounded-md"
          onClick={() =>
            updateModalData("addBeneficiaryModal", { manual: true, user: null })
          }
        >
          <CiCirclePlus className="h-5 w-5 text-[#000000]" />
          <span className="text-md font-medium text-black">
            Manually add details
          </span>
        </button>
      </div>

      <div className=" flex flex-col gap-1  pb-5">
        {potentialBeneficiary?.data?.members && potentialBeneficiary.data.members.length > 0 ? (
          potentialBeneficiary.data.members.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 "
              >
                <UserProfileHint align="start" user={userProfile}>
                  <div className="flex items-center gap-2">
                    <CustomAvatar
                      image={item.user?.profileImage}
                      className="justify-start w-[45px] h-[45px]"
                      imageClassName="h-[45px] object-top text-[16px] font-bold text-primary border w-[45px] rounded-[12px] overflow-hidden flex items-center justify-center"
                      labelClassName="h-[45px] border-none w-[45px] rounded-[9px] overflow-hidden flex items-center justify-center"
                      alt="profile image"
                      showText={false}
                      disabled={true}
                      iconClassName="w-[30px] h-[30px]"
                      isCurrentUser={false}
                      userFullName={`${item.user?.firstName} ${item.user?.lastName}`}
                    />

                    <div className="flex items-center  gap-2">
                      <span className="text-[16px] font-medium">
                        {item.user?.firstName} {item.user?.lastName}
                      </span>
                      {item.user?.firstName && item.user?.lastName && (
                        <span className="h-2 w-2 bg-green-700 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </UserProfileHint>

                <button
                  className="px-6 py-1 bg-white border border-[#1D1C1D21] text-black text-sm rounded-full hover:bg-gray-50"
                  onClick={() => {
                    updateModalData("addBeneficiaryModal", {
                      manual: false,
                      user: item.user,
                      state: 2,
                    });
                  }}
                >
                  Select
                </button>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-center">
              {searchTerm ? (
                <>
                  <p>No members found for &quot;{searchTerm}&quot;</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </>
              ) : (
                <p>No potential beneficiaries available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddMembers;
