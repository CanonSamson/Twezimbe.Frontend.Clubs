"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import Link from "next/link";
import { useState } from "react";
import { formatAmount } from "@/utils/functions/formatAmount";
import { useMutation } from "@tanstack/react-query";
import { createCaseDisbursement } from "@/api/bereavement-fund/file-case";
import { useParams } from "next/navigation";
import { GrFormClose } from "react-icons/gr";
import AuthButton from "@/components/button/AuthButton";

const FundDisbursement = () => {
  const { toggleModal, modalData, updateModalData } = useSettingModal();
  const [selected, setSelected] = useState("principal");
  const [errors, setErrors] = useState<{ amount?: string; recipient?: string }>(
    {}
  );
  const bfId = useParams().bfId as string;

  const handleToggleModal = () => {
    toggleModal("fundDisbursementModal");
  };

  const caseData = modalData?.fundDisbursementModal?.case;

  const benefitsPayable = caseData?.benefitsPayable;

  const totalContributionsDisbursed = caseData?.totalContributionsDisbursed;

  const availableAmount =
    benefitsPayable +
    caseData?.totalcontributions -
    totalContributionsDisbursed;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { closeCaseAfterDisbursement: boolean }) =>
      createCaseDisbursement(bfId, caseData?.id, {
        amount: availableAmount,
        closeCaseAfterDisbursement: data.closeCaseAfterDisbursement,
      }),
    onSuccess: () => {
      updateModalData("fundDisbursementModal", {
        ...modalData?.fundDisbursementModal,
        state: 2,
      });
    },
  });

  const validate = () => {
    const newErrors: { amount?: string; recipient?: string } = {};

    if (!availableAmount || availableAmount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0.";
    }

    if (!selected) {
      newErrors.recipient = "Please select a recipient.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleDisburse = (close: boolean) => {
    if (validate()) {
      mutate({ closeCaseAfterDisbursement: close });
    }
  };

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <span className="font-bold text-[25px] leading-[150%] tracking-[-0.03px]">
          Disburse fund
        </span>
        <button onClick={handleToggleModal}>
          <GrFormClose className="size-[24px]" />
        </button>
      </div>

      <p className="w-full mt-4 font-normal text-sm leading-[150%] text-gray-600">
        Here is a breakdown of the current disbursement
      </p>

      {/* Summary Table */}
      <div className="w-full mt-6 bg-gray-50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                Item
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700"></th>
              <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">
                Remark
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="py-3 px-4 text-sm text-gray-900">
                Benefits Payable
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                UGX {formatAmount(Number(benefitsPayable || 0).toFixed(2))}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 text-center">
                {caseData?.isBenefitPaid ? "Paid" : "-"}
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="py-3 px-4 text-sm text-gray-900">
                Total case contributions
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                UGX {formatAmount(String(caseData?.totalcontributions || 0))}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 text-center">-</td>
            </tr>

            <tr className="border-t border-gray-200 bg-white">
              <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                Total Disbursement
              </td>
              <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                UGX {formatAmount(String(totalContributionsDisbursed || 0))}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 text-center">-</td>
            </tr>
            <tr className="border-t border-gray-200 bg-white">
              <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                Available to disburse
              </td>
              <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                UGX {formatAmount(Number(availableAmount || 0).toFixed(2))}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 text-center">-</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recipient select */}
      <div className="w-full mt-8">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Recipient
        </label>
        <div className="relative">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="principal">Principal</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {errors.recipient && (
          <p className="mt-1 text-sm text-red-600">{errors.recipient}</p>
        )}
      </div>

      <div className="w-full mt-4">
        <p className="font-normal text-sm leading-[150%] text-gray-600">
          The default recipient is the principal except in cases where the
          principal is listed as the affected person{" "}
          <Link
            href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/faqs#What-happens-during-a-bereavement-case`}
            className="text-primary hover:text-blue-800"
          >
            Learn more
          </Link>
        </p>
      </div>

      {/* Submit buttons */}
      <div className="w-full mt-8 flex gap-3">
        <AuthButton
          handleClick={() => handleDisburse(false)}
          disabled={isPending}
          text={isPending ? "Disburse ..." : "Disburse"}
          className="flex-1 py-3 px-4  bg-primary hover:bg-primary/85  text-white text-sm font-medium"
        />

        <AuthButton
          handleClick={() => handleDisburse(true)}
          disabled={isPending}
          text={isPending ? "Disburse ..." : "Disburse And Close Case"}
          className="flex-1 py-3 px-4 bg-white  border border-primary text-primary hover:border-primary/85 text-sm font-medium"
        />
      </div>
    </>
  );
};

export default FundDisbursement;
