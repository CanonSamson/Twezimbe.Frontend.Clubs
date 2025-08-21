"use client";

import { IoClose } from "react-icons/io5";
import React, { useRef, useState } from "react";

const Confirm: React.FC<{
  next: () => void;
  handleToggleModal: () => void;
}> = ({ next, handleToggleModal }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((val) => val.trim() !== "");

  return (
    <>
      <div className="p-4">
        <div className="flex justify-end items-center mb-4">
          <button
            className="text-divider-200 hover:text-divider-300 duration-500 transition-colors"
            onClick={handleToggleModal}
          >
            <IoClose size={34} />
          </button>
        </div>

        <div className="text-start">
          <h4 className="text-xl font-semibold">Confirm Withdrawal</h4>
          <p className="text-[13px] mt-2 text-[#969696]">Enter OTP code</p>

          <div className="flex flex-col items-center gap-3 mt-8">
            <div className="flex gap-2 justify-start w-full">
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength={1}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  onChange={(e) => handleInputChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  value={otp[i]}
                  className="w-10 h-12 text-center border border-gray-300 text-lg focus:outline-none focus:ring-2 bg-divider-100"
                />
              ))}
            </div>
          </div>

          <p className="text-[#969696] mt-6 text-[13px]">
            Didn&apos;t see the code?{" "}
            <span className="text-primary font-bold">Resend Code</span>
          </p>
        </div>
        <p className="text-[#969696] mt-6 text-[13px]">
          Enter the OTP code sent to your registered number to complete this
          transaction.{" "}
          <span className="text-primary font-bold">Learn more</span>
        </p>
      </div>

      <div className="flex bg-white p-3 gap-3 w-full">
        <button
          className={`w-full px-4 py-2 rounded-md text-white ${
            isOtpComplete
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={next}
          disabled={!isOtpComplete}
        >
          Withdraw
        </button>
      </div>
    </>
  );
};

export default Confirm;
