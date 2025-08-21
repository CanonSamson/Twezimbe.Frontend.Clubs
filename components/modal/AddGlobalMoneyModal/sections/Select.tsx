"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
// import { useParams } from "next/navigation";
// import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";

const Select: React.FC<{
  next: () => void;
  //   back: () => void;
  handleToggleModal: () => void;
  selectedCurrency: "ugx" | "usd" | null;
  setSelectedCurrency: (currency: "ugx" | "usd" | null) => void;
}> = ({ next, handleToggleModal, selectedCurrency, setSelectedCurrency }) => {
  //   const { modals } = useSettingModal();
  //   const groupId = useParams()?.groupId as string;

  const options = [
    {
      value: "ugx" as const,
      label: "Uganda Shillings (UGX)",
      iconSrc: "/icon/Uganda.svg",
      iconAlt: "Uganda flag",
    },
    {
      value: "usd" as const,
      label: "United States Dollars (USD)",
      iconSrc: "/icon/US.svg",
      iconAlt: "US flag",
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

        <h2 className="text-xl font-bold text-left mb-4">Select Currency</h2>

        <div className="rounded-lg w-full flex flex-col gap-4">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedCurrency(opt.value)}
              className={`
                flex items-center gap-2 p-3 rounded-md text-left
                ${
                  selectedCurrency === opt.value
                    ? "border-2 border-primary bg-white"
                    : "border border-gray-200"
                }
              `}
            >
              <input
                type="radio"
                name="currency"
                value={opt.value}
                checked={selectedCurrency === opt.value}
                readOnly
                className=""
              />
              <Image
                src={opt.iconSrc}
                alt={opt.iconAlt}
                width={20}
                height={20}
              />
              <span className="flex-1">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-3">
        <button
          className="w-full px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          onClick={next}
          disabled={!selectedCurrency}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default Select;
