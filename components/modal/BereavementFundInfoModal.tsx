"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import CustomDialog from "../custom/CustomDialog";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading } from "react-icons/ai";
import { useAppSelector } from "@/lib/hooks";
import { hasBfPermission } from "@/utils/permissions/bf/bf-abac";
import { UserContext } from "@/contexts/user";
import { useContextSelector } from "use-context-selector";
import { getSubscriptionStats } from "@/api/bereavement-fund";
import { formatAmount } from "@/utils/functions/formatAmount";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const BereavementFundInfoModal = () => {
  const { modals, modalData, toggleModal, closeModal } = useSettingModal();
  const storedBf = useAppSelector((state) => state.bf.bf);

  const groupId = useParams()?.groupId as string
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );
  const bf = modalData?.bereavementFundInfoModal;
  const bfData = storedBf?.[bf?.id];

  const handleSendRequest = () => {
    toggleModal("bereavementFundInfoModal", null);
    toggleModal("requestToJoinBfModal", { bf, state: 1 });
  };

  const { data: statsData, isLoading } = useQuery({
    queryKey: [bf?.id, "getSubscriptionStats"],
    queryFn: async () => getSubscriptionStats(bf?.id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!bf?.id || !!modals?.bereavementFundInfoModal,
  });
  const stats = statsData?.data?.stats;

  const router = useRouter()

  return (
    <CustomDialog
      open={modals?.bereavementFundInfoModal}
      close={() => {}}
      name="bereavementFundInfoModal"
      contentClassName="sm:max-w-[525px] max-h-[70dvh] overflow-y-auto py-10 z-[55] bg-white
                max-tablet-lg:max-h-[85dvh] max-tablet-lg:py-6 max-tablet-lg:max-w-full"
    >
      <Image
        src="/icon/bar.svg"
        alt="gray-bar"
        width={70}
        height={70}
        className="absolute top-4 left-1/2 -translate-x-1/2 tablet-lg:hidden"
      />
      <div className="flex flex-col bg-white rounded-t-[10px] rounded-b-[10px]  mt-10 relative">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <AiOutlineLoading className=" text-primary size-[24px] animate-spin duration-300 transition-all" />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-start justify-between max-tablet-lg:items-center">
              <div className="flex items-center gap-5 -mt-10">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 justify-center tablet-lg:justify-start mt-2">
                    <span className="text-[22px] line-clamp-1 font-extrabold text-[#1D1C1D]">
                      {bf?.name}
                    </span>
                  </div>
                  <div className="pr-[10%] flex w-full">
                    <span className="font-medium whitespace-pre-line line-clamp-2 text-[#49454FCC] text-[16px]">
                      {stats?.fundDetails}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-6">
              <div className="w-full mb-6 ">
                <table className="min-w-full text-sm  rounded">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-right">YTD</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    <tr className="border-t">
                      <td className="p-3">
                        Maximum Beneficiaries Per Principal
                      </td>
                      <td className="p-3 text-right">
                        {stats?.maxBeneficiariesPerPrincipal}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Membership Fee (One-Off)</td>
                      <td className="p-3 text-right flex justify-end items-center gap-2">
                        <span>
                          UGX {formatAmount(String(stats?.membershipFee || 0))}
                        </span>
                        <span className="text-green-600 flex items-center text-xs">
                          <svg
                            className="w-3 h-3 fill-green-600 mr-1"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 12l5-5 5 5H5z" />
                          </svg>
                          0.00%
                        </span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Annual subscription base fee</td>
                      <td className="p-3 text-right flex justify-end items-center gap-2">
                        <span>
                          UGX{" "}
                          {formatAmount(String(stats?.annualSubscription || 0))}
                        </span>
                        <span className="text-orange-500 flex items-center text-xs">
                          <svg
                            className="w-3 h-3 fill-orange-500 mr-1 rotate-180"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 12l5-5 5 5H5z" />
                          </svg>
                          0.00%
                        </span>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Waiting Period</td>
                      <td className="p-3 text-right">{stats?.waitingPeriod}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Standard Benefit Limit</td>
                      <td className="p-3 text-right flex justify-end items-center gap-2">
                        <span>UGX {formatAmount(String(0))}</span>
                        <span className="text-green-600 flex items-center text-xs">
                          <svg
                            className="w-3 h-3 fill-green-600 mr-1 rotate-180"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 12l5-5 5 5H5z" />
                          </svg>
                          0.00%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center w-full">
              {bfData?.roles &&
              hasBfPermission(
                {
                  blockedBy: [],
                  id: currentUser?.id as string,
                },
                bfData?.roles,
                "fundRules",
                "view",
                {
                  groupId: groupId,
                  bfId: bf.id as string,
                }
              ) ? (
                <button
                  onClick={() => {
                    router.push(`/bf/settings/${groupId}/${bf.id}`)
                    closeModal("bereavementFundInfoModal")
                  }}
                  className="bg-primary text-white w-full py-4 rounded-lg font-bold text-[16px] hover:bg-blue-400 transition"
                >
                  Edit
                </button>
              ) : bfData?.roles &&
                hasBfPermission(
                  {
                    blockedBy: [],
                    id: currentUser?.id as string,
                  },
                  bfData?.roles,
                  "principal",
                  "view",
                  {
                    groupId: "groupId" as string,
                    bfId: bf.id as string,
                  }
                ) ? null : (
                <button
                  onClick={handleSendRequest}
                  className="bg-primary text-white w-full py-4 rounded-lg font-bold text-[16px] hover:bg-primary/70 transition-all duration-300"
                >
                  Request to Join
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </CustomDialog>
  );
};

export default BereavementFundInfoModal;
