"use client";

import CustomTextInput from "@/components/input/CustomTextInput";
import Image from "next/image";
import { useState } from "react";
import { LuInfo } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";

const Pool: React.FC<{
  handleToggleModal: () => void;
  next: () => void;
}> = ({ handleToggleModal, next }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [preferenceError, setPreferenceError] = useState("");

  const options = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  const handleSubmit = () => {
    let hasError = false;

    if (!amount) {
      setAmountError("Please enter an amount");
      hasError = true;
    }
    if (!selected) {
      setPreferenceError("Please select a saving preference");
      hasError = true;
    }

    if (hasError) return;

    console.log({ amount, frequency: selected });
    next();
  };

  return (
    <>
      <div className="w-full overflow-y-auto">
        <div className="relative">
          <div className="absolute top-4 right-4">
            <IoIosCloseCircleOutline
              onClick={handleToggleModal}
              className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700"
            />
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="text-start space-y-1 mb-4">
            <h1 className="font-bold text-black text-lg">
              Add Funds to Group Pool
            </h1>
            <p className="text-black text-sm">
              Contribute to group savings and increase your earnings
            </p>
          </div>

          <div className="flex items-center gap-2 text-black bg-blue-200 rounded-md p-2 mb-4">
            <LuInfo className="text-gray-600" />
            <span className="text-xs">
              Group minimum target amount per member: UGX 250,000
            </span>
          </div>

          <p>Preferred amount to save per time</p>
          <CustomTextInput
            type="text"
            id="amount"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAmount(e.target.value);
              setAmountError("");
            }}
            placeholder="UGX 500,000"
            className="mt-4"
          />
          {amountError && (
            <p className="text-red-500 text-xs mt-1">{amountError}</p>
          )}

          <div className="mt-4">
            <h1>How will you prefer to save?</h1>
            <div className="flex items-center gap-6">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setSelected(option.value);
                    setPreferenceError("");
                  }}
                  className={`flex flex-col items-center border border-gray-400 rounded-md p-4 cursor-pointer transition-colors ${
                    selected === option.value
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                >
                  <Image
                    src="/icon/ballyhand.svg"
                    alt={option.label}
                    width={40}
                    height={40}
                  />
                  <span className="mt-2 text-sm font-medium">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
            {preferenceError && (
              <p className="text-red-500 text-xs mt-1">{preferenceError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full p-2 bg-white -mt-6">
        <button
          className="w-full py-2 bg-primary text-white rounded-lg"
          onClick={handleSubmit}
        >
          Proceed
        </button>
      </div>
    </>
  );
};

export default Pool;
