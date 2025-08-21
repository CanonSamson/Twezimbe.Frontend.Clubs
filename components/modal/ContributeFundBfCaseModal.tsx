"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomBfCurrencyInput from "../input/CustomBfCurrencyInput";
import { useFormik } from "formik";
import AuthButton from "../button/AuthButton";
import { useParams } from "next/navigation";
import CustomSelect from "../input/CustomSelect";
import { PayTypeTypes } from "@/utils/data/pay";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  contributeToCaseWithBfWallet,
  getBfWallet,
} from "@/api/bereavement-fund/wallet";
import { UserContext } from "@/contexts/user";
import { formatAmount } from "@/utils/functions/formatAmount";
import { queryClient } from "@/contexts/ProviderWrapper";
import { useContextSelector } from "use-context-selector";

// Types
interface ContributeFormValues {
  amount: number;
  method: string;
}

interface WalletResponse {
  data: {
    data: {
      balance: number;
    };
  };
}


// BF Wallet Contribution Response (matches actual API structure)
interface BfContributionResponse {
  data: {
    success: boolean;
    message: string;
    payment?: {
      id: string;
      amount: number;
      status: string;
      paymentUrl?: string;
      reference: string;
    };
  };
}




const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .min(50, "Amount must be greater than 50"),
  method: Yup.string().required("Payment method is required"),
});

const ContributeFundBfCaseModal: React.FC = () => {
  const { toggleModal, modals, modalData } = useSettingModal();
  const { caseId: paramsCaseId } = useParams<{ caseId: string }>();

  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );

  const caseId: string | undefined = modalData?.contributeFundBfCaseModal?.id;

  // Calculate 5% add-on fee
  const calculateAddOnFee = (amount: number): number => {
    return Math.round(amount * 0.05);
  };

  const { values, setFieldValue, errors, touched, handleSubmit } =
    useFormik<ContributeFormValues>({
      initialValues: {
        amount: 0,
        method: "bfwallet",
      },
      validationSchema,
      onSubmit: (values: ContributeFormValues) => {
        if (values.method === "flutterwave") {
          toast.info("Not implemented yet");
          return;
        }

        mutate();
        console.log("Form values:", values);
      },
    });

  const addOnFee: number = calculateAddOnFee(values?.amount || 0);
  const totalAmountWithFee: number = (values?.amount || 0) + addOnFee;

  const handleCurrencyChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = Number(e.target.value.replace(/,/g, ""));
      setFieldValue(fieldName, numericValue);
    };

  const { mutate, isPending } = useMutation<
    BfContributionResponse,
    Error,
    void
  >({
    mutationFn: (): Promise<BfContributionResponse> =>
      contributeToCaseWithBfWallet(caseId || paramsCaseId, {
        amount: String(totalAmountWithFee), // Include fee in contribution
        fundId: modalData?.contributeFundBfCaseModal?.fundId,
      }),
    onSuccess: (response: BfContributionResponse) => {
      toggleModal("contributeFundBfCaseModal", null);
      queryClient.invalidateQueries({
        queryKey: ["get-case-donation-contribution", caseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["case-details", caseId],
      });
      toast.success("Funding case successfully");
      console.log("Contribution response:", response);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Contribution failed");
    },
  });

  const { data: wallet } = useQuery<WalletResponse>({
    queryKey: [
      modalData?.contributeFundBfCaseModal?.fundId,
      "user-wallet",
      currentUser?.id,
    ],
    queryFn: () =>
      getBfWallet(modalData?.contributeFundBfCaseModal?.fundId as string),
    enabled: !!modalData?.contributeFundBfCaseModal?.fundId,
  });

  // Get beneficiary name with proper null checking
  const getBeneficiaryName = (): string => {
    const beneficiary = modalData?.contributeFundBfCaseModal?.beneficiary;
    const firstName =
      beneficiary?.firstName || beneficiary?.beneficiary?.firstName || "";
    const lastName =
      beneficiary?.lastName || beneficiary?.beneficiary?.lastName || "";
    return `${firstName} ${lastName}`.trim();
  };

  return (
    <div
      className={`fixed inset-0 z-[50] items-center justify-center ${
        modals?.contributeFundBfCaseModal ? "flex" : " hidden"
      }`}
    >
      <div
        className="fixed inset-0 z-2 bg-black opacity-50"
        onClick={() => toggleModal("contributeFundBfCaseModal")}
      />

      <div className="bg-white rounded-lg shadow-lg max-h-[70vh] w-[90%] max-w-[600px] overflow-auto z-10">
        <div className="p-5 mb-8">
          <div className="flex justify-end items-center mb-4">
            <button
              className="text-divider-200 hover:text-divider-300 duration-500 transition-colors relative tablet-lg:bottom-0 bottom-3 tablet-lg:left-0 left-4"
              onClick={() => toggleModal("contributeFundBfCaseModal")}
            >
              <IoClose size={25} />
            </button>
          </div>

          <div className="flex flex-col tablet-lg:flex-row items-center gap-4 w-full -mt-5">
            {modalData?.contributeFundBfCaseModal?.coverImage ? (
              <Image
                src={modalData?.contributeFundBfCaseModal?.coverImage}
                alt="funeral"
                width={200}
                height={200}
                className="object-cover rounded-lg h-[100px] w-full tablet-lg:w-[30%]"
              />
            ) : (
              <div />
            )}

            <div className="text-start flex-1 w-full tablet-lg:w-[70%]">
              <h2 className="text-xl font-extrabold">
                You are supporting Help us fund a{" "}
                {modalData?.contributeFundBfCaseModal?.caseName} case
              </h2>
              <p className="text-gray-600 text-[14px] mt-1 w-full tablet-lg:w-[80%]">
                Your donation will benefit {getBeneficiaryName()}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <CustomBfCurrencyInput
              type="text"
              id="amount"
              value={values.amount}
              label="Enter your donation"
              placeholder="2000"
              className="mt-4 "
              inputClassName="bg-divider-100 font-normal"
              onChange={handleCurrencyChange("amount")}
              disabled={false}
              error={
                touched.amount && errors.amount
                  ? errors.amount.toString()
                  : undefined
              }
            />

            {/* Fee Breakdown Section */}
            {values.amount > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <h3 className="font-semibold text-sm mb-2">
                  Donation Breakdown
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Donation Amount:</span>
                    <span>UGX {formatAmount(String(values.amount))}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Add-on Fee (5%):</span>
                    <span>UGX {formatAmount(String(addOnFee))}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>UGX {formatAmount(String(totalAmountWithFee))}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  The beneficiary will receive UGX{" "}
                  {formatAmount(String(values.amount))}
                </p>
              </div>
            )}

            <CustomSelect
              selectTriggerClassName="bg-divider-100 font-normal"
              label="Method"
              options={[
                {
                  value: "bfwallet",
                  label: `Bf Wallet (UGX ${formatAmount(
                    String(wallet?.data.data.balance || 0)
                  )})`,
                },
                { value: "flutterwave", label: "Mobile Money or Card" },
              ]}
              placeholder="Select Payment Method"
              value={values.method}
              onChange={(value: string) =>
                setFieldValue("method", value as PayTypeTypes)
              }
              disabled={true}
            />
          </div>

          <div className="flex justify-center mt-10">
            <AuthButton
              text={`Donate${
                values.amount > 0
                  ? ` - UGX ${formatAmount(String(totalAmountWithFee))}`
                  : ""
              }`}
              handleClick={() => handleSubmit()}
              isLoading={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributeFundBfCaseModal;
