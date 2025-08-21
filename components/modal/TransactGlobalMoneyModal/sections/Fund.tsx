"use client";

import { IoClose } from "react-icons/io5";
import CustomSelect from "@/components/input/CustomSelect";
import * as React from "react";
import CustomTextInput from "@/components/input/CustomTextInput";

const Fund: React.FC<{
  next: () => void;
  // back: () => void;
  handleToggleModal: () => void;
}> = ({ next, handleToggleModal }) => {
  const [amount, setAmount] = React.useState("");
  // const [mobileMoneyNumber, setMobileMoneyNumber] = React.useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<
    null | string
  >(null);
  const [selectedFundSource, setSelectedFundSource] = React.useState<
    null | string
  >(null);

  const fundOptions = [
    { value: "bereavement_fund", label: "Benevolent Fund" },
    { value: "sacco_savings", label: "SACCO Savings" },
    { value: "crowdfunding", label: "Crowdfunding" },
  ];

  const bereavementOptions = [
    { value: "my_first", label: "My first fund - UGX 15,560" },
    { value: "my_second", label: "My second fund - USD 0" },
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
          {/* <CustomTextInput
            type="text"
            id="fundAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            label="Sub-wallet"
            placeholder="Enter amount"
            inputClassName="bg-gray-50"
          /> */}

          <div className="mt-4">
            <CustomSelect
              // label="Benevolent Fund"
              label="Sub-wallet"
              placeholder="Select payment method"
              options={fundOptions}
              value={selectedPaymentMethod || ""}
              onChange={(value) => setSelectedPaymentMethod(value as string)}
              className="font-inter text-gray-700"
            />
          </div>

          {selectedPaymentMethod === "bereavement_fund" && (
            <div className="mt-4">
              <CustomSelect
                label="Benevolent Fund"
                placeholder="Select source"
                options={bereavementOptions}
                value={selectedFundSource || ""}
                onChange={(value) => setSelectedFundSource(value as string)}
                className="font-inter text-gray-700"
              />
            </div>
          )}
          <CustomTextInput
            type="text"
            id="fundAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            label="Amount to fund"
            placeholder="Enter amount"
            inputClassName="bg-gray-50"
          />
        </div>
      </div>

      <div className="w-full bg-white p-3 flex justify-center">
        <button
          className="w-full max-w-md px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          onClick={next}
          // disabled={!amount || !selectedPaymentMethod}
        >
          Fund Wallet
        </button>
      </div>
    </>
  );
};

export default Fund;
