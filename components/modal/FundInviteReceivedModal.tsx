"use client";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomDialog from "../custom/CustomDialog";
import Image from "next/image";
import AuthButton from "../button/AuthButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  acceptBereavementFundInvite,
  declineBereavementFundInvite,
} from "@/api/invite/bf-invite";
import { formatAmount } from "@/utils/functions/formatAmount";

export interface FundInviteReceivedModalData {
  fundId: string;
  groupId: string;
  invite: {
    id: string;
  };
  receiverId: string;
  fund: {
    id: string;
    name: string;
    annualSubscription: number;
    subscription: number;
    membershipFee: number;
  };
}

const FundInviteReceivedModal = () => {
  const { modals, modalData, closeModal } = useSettingModal();
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">(
    "pending"
  );

  // Get the modal data with proper typing
  const data =
    modalData?.fundInviteReceivedModal as FundInviteReceivedModalData;

  // Extract invite and fund data
  const invite = data?.invite;
  const fund = data?.fund;

  // Benevolent Fund invite mutations
  const {
    mutate: acceptBereavementFundInviteMutation,
    isPending: isAcceptingBereavementFundInvite,
  } = useMutation({
    mutationFn: () => acceptBereavementFundInvite(invite?.id as string),
    onSuccess: () => {
      toast.success("Invite accepted! Redirecting to the fund?...");

      router.push(`/bf/${data.groupId}/${data.fundId}/principal`);
      closeModal("fundInviteReceivedModal");

      setStatus("accepted");
    },
    onError: (error) => {
      console.error("Error accepting BF invite:", error);
      toast.error(error.message || JSON.stringify(error));
    },
  });

  const {
    mutate: declineBereavementFundInviteMutation,
    isPending: isDecliningBereavementFundInvite,
  } = useMutation({
    mutationFn: () => declineBereavementFundInvite(invite?.id as string),
    onSuccess: () => {
      toast.success("Invite declined");
      setStatus("declined");
      closeModal("fundInviteReceivedModal");
    },
    onError: (error) => {
      console.error("Error declining BF invite:", error);
      toast.error(error.message || JSON.stringify(error));
    },
  });

  const handleAccept = () => {
    if (!invite?.id) {
      toast.error("Invalid invite data");
      return;
    }
    acceptBereavementFundInviteMutation();
  };

  const handleDecline = () => {
    if (!invite?.id) {
      toast.error("Invalid invite data");
      return;
    }
    declineBereavementFundInviteMutation();
  };

  useEffect(() => {
    console.log(modals, "modals")
  },[modals])
  
  return (

    <CustomDialog
      open={!!modals?.fundInviteReceivedModal}
      close={() => {
        closeModal("fundInviteReceivedModal");
      }}
      name="fundInviteReceivedModal"
      contentClassName="sm:max-w-[525px] max-h-[70dvh] overflow-y-auto py-10 z-[55] bg-white"
    >
      <div className="flex flex-col items-center justify-center">
        <Image
          src={`/assets/images/icons/bell.svg`}
          className="h-[150px] w-auto"
          width={200}
          height={200}
          alt="bell logo"
        />
        <h1 className="mt-4 text-xl font-bold text-center">
          You have received an invite
        </h1>

        <p className="text-center mb-6 px-10 mt-4 text-[12px]">
          You have been invited to join the <strong>{fund?.name}</strong> Fund.
          Here is the breakdown of the fees you have to pay to become a member
          of the fund.
        </p>

        {/* Fee Breakdown Table */}
        <div className="w-full mb-8">
          <table className="w-full text-sm text-left rounded">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-3">Fee Type</th>
                <th className="p-3 text-right">Amount (UGX)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t">
                <td className="p-3">Membership Fee (One-Off)</td>
                <td className="p-3 text-right">
                  UGX {formatAmount(String(fund?.membershipFee || 0))}
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Annual subscription base fee</td>
                <td className="p-3 text-right">
                  UGX {formatAmount(String(fund?.annualSubscription || 0))}
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Monthly subscription fee</td>
                <td className="p-3 text-right">
                  UGX {formatAmount(String(fund?.subscription || 0))}
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Age-based add-on fees</td>
                <td className="p-3 text-right">Depends on beneficiaries</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-center text-gray-500 mt-3">
            Age based add-on fees are calculated based on the age of each person
            you add.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <AuthButton
            text="Accept"
            handleClick={handleAccept}
            isLoading={isAcceptingBereavementFundInvite}
            disabled={status !== "pending"}
          />
          <AuthButton
            text="Decline"
            className="bg-red-600 hover:bg-red-700"
            handleClick={handleDecline}
            isLoading={isDecliningBereavementFundInvite}
            disabled={status !== "pending"}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default FundInviteReceivedModal;
