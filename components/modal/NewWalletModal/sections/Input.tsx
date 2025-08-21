"use client";

import { IoClose } from "react-icons/io5";
// import { useParams } from "next/navigation";
// import { useSettingModal } from "@/contexts/modal-setting";
import CustomSelect from "@/components/input/CustomSelect";
import Image from "next/image";
import * as React from "react";

const Input: React.FC<{
  next: () => void;
  back: () => void;
  handleToggleModal: () => void;
}> = ({ next, back, handleToggleModal }) => {
  // const { modals } = useSettingModal();
  // const groupId = useParams()?.groupId as string;

  const [currency, setCurrency] = React.useState("");

  const options = [
    {
      value: "ugandan_shillings",
      label: "Ugandan Shillings",
      icon: (
        <Image
          src="/icon/Uganda.svg"
          alt="Uganda flag"
          width={20}
          height={20}
        />
      ),
    },
    {
      value: "us_dollars",
      label: "US Dollars",
      icon: <Image src="/icon/US.svg" alt="US flag" width={20} height={20} />,
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

        <h2 className="text-xl font-bold text-left">
          Choose your wallet currency
        </h2>
        <p className="text-[12px] text-divider-200 mb-6 text-left line-clamp-2">
          Select the currency you want to open a wallet in under your global
          personal wallet. No worries, you can open more wallets later :)
        </p>

        <div className="rounded-lg w-full">
          <CustomSelect
            placeholder="Select Currency"
            options={options}
            value={currency}
            onChange={setCurrency}
            className="font-inter text-gray-700 bg-gray-200"
          />
        </div>
      </div>

      <div className="flex bg-white p-3 gap-3 justify-end">
        <button
          className="px-4 py-2 bg-white border border-gray-700 text-primary rounded-md"
          onClick={back}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={next}
          //   disabled={!currency}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Input;
