"use client";

import Image from "next/image";
import { PiCopySimpleFill } from "react-icons/pi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const Domiciliary: React.FC<{
  handleToggleModal: () => void;
  //   next: () => void;
}> = ({ handleToggleModal }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const bankDetails = [
    { label: "Bank Name", value: "Cairo Bank Uganda" },
    { label: "Account Name", value: "Twezi Ltd" },
    { label: "Account Number", value: "1234567890" },
    { label: "SWIFT Code", value: "EQBLUGKA" },
    {
      label: "Bank Address",
      value: "Equity Bank Towers, 390 Mutesa II Road, Kampala, Uganda",
    },
    { label: "Intermediary bank", value: "Citibank" },
    { label: "Routing Number", value: "021078089" },
    { label: "Intermediary bank address", value: "New York, United States" },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <div className="max-h-[60vh] w-full overflow-y-auto">
        <div className="relative">
          <div className="absolute top-0 right-0 p-4 flex justify-end w-full">
            <button
              className="text-divider-200 hover:text-divider-300 transition-colors duration-200"
              onClick={handleToggleModal}
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="flex justify-center mb-4">
            <Image src="/icon/bank.svg" alt="shape" width={120} height={120} />
          </div>

          <div className="text-center space-y-1">
            <h1 className="font-bold text-black text-lg">
              USD Domiciliary Transfer
            </h1>
            <p className="text-[12px] text-black mb-6 text-center line-clamp-2">
              Make a USD transfer to this account number and your global wallet
              will be funded immediately. Ensure transfers only originate from
              accounts bearing your official name
            </p>
          </div>

          <div className="w-full">
            <div className="h-px bg-gray-300 mx-4 mb-4" />
          </div>

          <div className="space-y-3">
            {bankDetails.map((detail, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {detail.label}:
                  </p>
                  <p className="text-sm font-mono mt-1">{detail.value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(detail.value, detail.label)}
                  className="text-primary hover:text-primary-dark transition-colors"
                  title="Copy"
                >
                  <PiCopySimpleFill size={20} />
                  {copied === detail.label && (
                    <span className="absolute -mt-6 -mr-4 text-xs bg-black text-white px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Domiciliary;
