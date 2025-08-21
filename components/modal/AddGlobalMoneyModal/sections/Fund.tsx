"use client";

import { IoClose } from "react-icons/io5";
// import { useParams } from "next/navigation";
// import { useSettingModal } from "@/contexts/modal-setting";
import CustomSelect from "@/components/input/CustomSelect";
// import Image from "next/image";
import * as React from "react";
import CustomTextInput from "@/components/input/CustomTextInput";

const Fund: React.FC<{
  next: () => void;
  //   back: () => void;
  handleToggleModal: () => void;
  selectedPaymentMethod:
    | "mobile_money"
    | "debit_credit"
    | "bank_transfer"
    | null;
  setSelectedPaymentMethod: (
    method: "mobile_money" | "debit_credit" | "bank_transfer" | null
  ) => void;
  isFromExchange: boolean;
}> = ({
  next,
  handleToggleModal,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isFromExchange,
}) => {
  //   const { modals } = useSettingModal();
  //   const groupId = useParams()?.groupId as string;
  const [amount, setAmount] = React.useState("");
  const [mobileMoneyNumber, setMobileMoneyNumber] = React.useState("");

  const options = [
    ...(isFromExchange
      ? []
      : [{ value: "mobile_money", label: "Mobile Money" }]),
    {
      value: "debit_credit",
      label: "Debit/Credit card",
    },
    {
      value: "bank_transfer",
      label: "Bank Transfer",
    },
  ];

  return (
    <>
      <div className="p-4">
        <div className="flex justify-end mb-4">
          <button
            className="text-divider-200 hover:text-divider-300 transition-colors duration-200"
            onClick={handleToggleModal}
          >
            <IoClose size={24} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-left">Fund your wallet</h2>

        <div className="rounded-lg w-full gap-4 mt-4">
          <CustomTextInput
            type="text"
            id="fundAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            label="Amount to fund"
            placeholder="Enter amount"
            inputClassName="bg-gray-50"
          />

          <div className="mt-4">
            <CustomSelect
              label="Payment method"
              placeholder="Select payment method"
              options={options}
              value={selectedPaymentMethod || ""}
              onChange={(value) =>
                setSelectedPaymentMethod(
                  value as "mobile_money" | "debit_credit" | "bank_transfer"
                )
              }
              className="font-inter text-gray-700"
            />
          </div>

          {selectedPaymentMethod === "mobile_money" && (
            <div className="mt-4">
              <CustomTextInput
                type="tel"
                id="mobileMoneyNumber"
                value={mobileMoneyNumber}
                onChange={(e) => setMobileMoneyNumber(e.target.value)}
                label="Mobile Money Number"
                placeholder="Enter mobile number"
                inputClassName="bg-gray-50"
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full bg-white p-3 flex justify-center">
        <button
          className="w-full max-w-md px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          onClick={next}
          disabled={!amount || !selectedPaymentMethod}
        >
          Fund Wallet
        </button>
      </div>
    </>
  );
};

export default Fund;
