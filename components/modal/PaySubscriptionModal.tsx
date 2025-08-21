"use client";

import React, { useEffect, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { useSettingModal } from "@/contexts/modal-setting";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBfWallet, payBfSubscriptions } from "@/api/bereavement-fund/wallet";
import { useUser } from "@/contexts/user";
import { useParams, useRouter } from "next/navigation";
import { formatAmount } from "@/utils/functions/formatAmount";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { handleCurrencyChange } from "@/utils/functions/handleCurrencyChange";
import AuthButton from "../button/AuthButton";
import CustomBfCurrencyInput from "../input/CustomBfCurrencyInput";
import { queryClient } from "@/contexts/ProviderWrapper";

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .min(50, "Amount must be greater than 50"),
});

const PaySubscriptionModal = () => {
  const { closeModal, modals, modalData } = useSettingModal();
  const { currentUser } = useUser({});
  const bfId = useParams()?.bfId as string;
  const groupId = useParams()?.groupId as string;

  const data = modalData?.paySubscriptionModal;
  const totalPendingFee = data?.totalPendingFee || 0;

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return payBfSubscriptions(bfId, {
        amount: Number(values.amount),
      });
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserBeneficiaryTotalPendingSubscriptionFee", bfId],
      });
      console.log("response", response);
      closeModal("paySubscriptionModal");
      setFieldValue("amount", 0);
      toast.success("Payment successful");
    },
    onMutate: () => {
      refetchWallet();
    },
    onError: (data) => {
      toast.error(data.message || JSON.stringify(data));
    },
  });

  const { data: wallet, refetch: refetchWallet } = useQuery({
    queryKey: [bfId, "user-wallet", currentUser?.id],
    queryFn: () => getBfWallet(bfId as string),
    enabled: !!bfId,
  });

  const { values, setFieldValue, errors, touched, handleSubmit } = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      if (values.amount > totalPendingFee) {
        toast.error(
          `Amount cannot exceed total pending fee of UGX ${formatAmount(
            String(totalPendingFee)
          )}`
        );
        return;
      }

      // Check if wallet has sufficient balance including charges
      const walletBalance = wallet?.data?.data?.balance || 0;
      if (walletBalance < chargeDetails.totalAmount) {
        toast.error(
          `Insufficient wallet balance. Required: UGX ${formatAmount(
            String(chargeDetails.totalAmount)
          )} (including UGX ${formatAmount(
            String(chargeDetails.chargeAmount)
          )} charges), Available: UGX ${formatAmount(String(walletBalance))}`
        );
        return;
      }

      mutate();
      console.log("Form values:", values);
    },
  });

  // Calculate charges for BF wallet payment (5% charge)
  const chargeDetails = useMemo(() => {
    const originalAmount = Number(values.amount) || 0;
    const chargeRate = 0.05; // 5% charge for wallet payments
    const chargeAmount = originalAmount * chargeRate;
    const totalAmount = originalAmount + chargeAmount;

    return {
      originalAmount,
      chargeAmount: parseFloat(chargeAmount.toFixed(2)),
      chargeRate,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  }, [values.amount]);

  useEffect(() => {
    if (values.amount === 0) setFieldValue("amount", totalPendingFee);
  }, [totalPendingFee]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        modals.paySubscriptionModal ? "flex" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={() => closeModal("paySubscriptionModal")}
      />

      <div className="bg-white rounded-lg shadow-lg max-h-[70vh] w-full max-w-md overflow-auto z-10">
        <div className="p-5 mb-8">
          <div className="flex justify-end items-center mb-4">
            <button
              className="text-divider-200 hover:text-divider-300 duration-500 transition-colors"
              onClick={() => closeModal("paySubscriptionModal")}
            >
              <IoClose size={25} />
            </button>
          </div>

          <div className="text-center mt-5">
            <h2 className="text-xl font-extrabold flex justify-start">
              Pay Subscription
            </h2>
            <p className="text-sm font-medium flex justify-start">
              Payments can be made in installments.
              <button
                className="ml-1"
                onClick={() => {
                  router.push(
                    `/bf/principal-settings/${groupId}/${bfId}/payment-settings`
                  );
                  setTimeout(() => {
                    closeModal("paySubscriptionModal");
                  }, 200);
                }}
              >
                <span className="text-primary cursor-pointer hover:underline">
                  Set Up
                </span>
              </button>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <CustomBfCurrencyInput
              type="text"
              id="membershipFee"
              value={values.amount}
              label="Amount"
              placeholder="2000"
              className="mt-4 "
              inputClassName="bg-divider-100 font-normal"
              onChange={handleCurrencyChange((amount) =>
                setFieldValue("amount", amount)
              )}
              disabled={false}
              error={
                touched.amount && errors.amount
                  ? errors.amount.toString()
                  : undefined
              }
            />

            {/* BF Wallet Balance Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-700">
                  BF Wallet Balance:
                </span>
                <span className="text-sm font-semibold text-blue-800">
                  UGX {formatAmount(String(wallet?.data?.data?.balance || 0))}
                </span>
              </div>
            </div>

            {/* Total Pending Fee Display */}
            {totalPendingFee > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-yellow-700">
                    Total Pending Fee:
                  </span>
                  <span className="text-sm font-semibold text-yellow-800">
                    UGX {formatAmount(String(totalPendingFee))}
                  </span>
                </div>
              </div>
            )}

            {/* Charges Summary */}
            {values.amount > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Payment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">
                      UGX {formatAmount(String(chargeDetails.originalAmount))}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge (5%):</span>
                    <span className="font-medium text-orange-600">
                      UGX {formatAmount(String(chargeDetails.chargeAmount))}
                    </span>
                  </div>

                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-orange-600">
                      UGX {formatAmount(String(chargeDetails.totalAmount))}
                    </span>
                  </div>
                </div>

                {/* Wallet balance check warning */}
                {(wallet?.data?.data?.balance || 0) < chargeDetails.totalAmount && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                    <p className="text-red-600 font-medium">
                      Insufficient wallet balance (including charges)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-5">
            <AuthButton
              text={
                values.amount > 0
                  ? `Pay UGX ${formatAmount(String(chargeDetails.totalAmount))}`
                  : "Make Payment"
              }
              handleClick={() => handleSubmit()}
              isLoading={isPending}
              disabled={
                (wallet?.data?.data?.balance || 0) < chargeDetails.totalAmount
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaySubscriptionModal;