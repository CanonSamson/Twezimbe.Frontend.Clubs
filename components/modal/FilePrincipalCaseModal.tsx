"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomAvatar from "../custom/CustomAvatar";
import { UserContext, UserContextType } from "@/contexts/user";
import UserProfileHint from "@/components/UserProfileHint";
import { useParams, useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useContextSelector } from "use-context-selector";
import { getBeneficialPrincipals } from "@/api/bereavement-fund/dashboard";

const FilePrincipalCaseModal = () => {
  const { modalData, modals, closeModal } = useSettingModal();
  const bfId = useParams()?.bfId as string;
  const router = useRouter();

  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  );

  const userProfile = {
    id: currentUser?.id ?? "",
    firstName: currentUser?.profile?.firstName ?? "",
    lastName: currentUser?.profile?.lastName ?? "",
    profileImage: currentUser?.profile?.profileImage ?? undefined,
    userName: currentUser?.profile?.userName ?? undefined,
  };

  const fundId = modalData?.fileCaseModal?.fundId;

  const { data } = useQuery({
    queryKey: ["beneficial-principals", bfId],
    queryFn: () => getBeneficialPrincipals(fundId || bfId),
    enabled: !!fundId || !!bfId,
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center tablet-lg:items-center tablet-lg:justify-center ${
        modals.filePrincipalCaseModal ? "flex" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={() => closeModal("filePrincipalCaseModal")}
      />

      <div className="bg-white rounded-tl-[18px] rounded-tr-[18px] tablet-lg:rounded-lg shadow-lg h-[40vh] w-full max-w-full tablet-lg:max-w-lg  z-10">
        <div className="p-5 mb-8">
          <div className="text-center mt-5">
            <Image
              src="/icon/bar.svg"
              alt="gray-bar"
              width={70}
              height={70}
              className="mb-0 relative bottom-6 mx-auto block tablet-lg:hidden"
            />
            <div className="flex flex-col tablet-lg:flex-row tablet-lg:justify-between items-center mb-4">
              <h2 className="text-xl font-black text-[24px] text-[#1D1C1D] order-1 tablet-lg:order-none mb-0 tablet-lg:mb-0">
                Select affected Principal
              </h2>

              <button
                className="hidden tablet-lg:block text-divider-200 hover:text-divider-300 duration-500 transition-colors order-2"
                onClick={() => closeModal("filePrincipalCaseModal")}
              >
                <IoClose size={25} />
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <div className="relative w-[1000px]">
              <input
                type="text"
                placeholder="Search principals"
                className="font-semibold text-[13px] w-full px-6 py-3 text-lg text-black bg-primary rounded-sm border border-primary focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-white placeholder:text-sm placeholder:font-normal"
              />
              <button className="absolute inset-y-0 right-3 flex items-center">
                <CiSearch className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className=" mt-5 flex flex-col gap-1 overflow-auto">
            {data?.data?.principals.map((principal, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center   justify-between gap-4  pb-5">
                    <UserProfileHint align="start" user={userProfile}>
                      <div className="flex items-center gap-2">
                        <CustomAvatar
                          image={principal?.profileImage}
                          className="justify-start w-[45px] h-[45px]"
                          imageClassName="h-[45px] object-top text-[16px] font-bold text-primary border w-[45px] rounded-[12px] overflow-hidden flex items-center justify-center"
                          labelClassName="h-[45px] border-none w-[45px] rounded-[9px] overflow-hidden flex items-center justify-center"
                          alt="profile image"
                          showText={false}
                          disabled={true}
                          iconClassName="w-[30px] h-[30px]"
                          isCurrentUser={false}
                          userFullName={`${principal?.firstName} ${principal?.lastName}`}
                        />

                        <div className="flex items-center  gap-2">
                          <span className="text-[16px] font-medium">
                            {principal?.firstName} {principal?.lastName}
                          </span>
                          {principal?.firstName && principal?.lastName && (
                            <span className="h-2 w-2 bg-green-700 rounded-full" />
                          )}
                        </div>
                      </div>
                    </UserProfileHint>

                    <button
                      className="px-6 py-1 bg-white border border-[#1D1C1D21] text-black text-sm rounded-full hover:bg-gray-50"
                      onClick={() => {
                        router.push(
                          `/bf/file-case/${bfId}/beneficiary/${principal.userId}`
                        );

                        closeModal("filePrincipalCaseModal");
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePrincipalCaseModal;
