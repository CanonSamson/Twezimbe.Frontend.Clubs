"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode, useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";

interface CustomTextInputProps {
  label?: string;
  placeholder: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  type: React.HTMLInputTypeAttribute | undefined;
  className?: string;
  inputClassName?: string;
  error?: string | undefined | false;
  id: string;
  showStar?: boolean;
  disabled?: boolean;
  LeftIcon?: React.ReactNode;
  verifyButton?: boolean;
  verifyButtonHandler?: () => void;
  verified?: boolean;
  isVerifing?: boolean;
  rightChild?: ReactNode;
  max?: string | number | undefined;
  min?: string | number | undefined;
 
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  id,
  type,
  label,
  placeholder,
  value,
  error,
  onChange,
  onFocus,
  onKeyDown,
  className,
  inputClassName,
  showStar = false,
  disabled = false,
  LeftIcon,
  verifyButton = false,
  verifyButtonHandler = () => {},
  verified = false,
  isVerifing = false,
  rightChild,
  max = undefined,
  min = undefined,
}) => {
  const [hide, setHide] = useState(true);

  return (
    <div
      className={`flex flex-col ${className} ${disabled ? "opacity-50" : ""}`}
    >
      {label && (
        <label>
          {label} <span className="text-red-600">{showStar && "*"}</span>
        </label>
      )}
      <div
        className={cn(
          `flex border rounded-[10px] border-divider mt-[2px] overflow-hidden relative`,
          inputClassName
        )}
      >
        {LeftIcon}
        <input
          id={id}
          className="px-4 flex disabled:cursor-not-allowed  flex-1 w-full h-[50px] focus:outline-none bg-transparent"
          type={hide ? type : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          disabled={disabled}
          readOnly={onChange ? false : true}
          min={min}
          max={max}
        />

        {rightChild ? (
          rightChild
        ) : (
          <>
            {verifyButton ? (
              <button
                type="button"
                className={`px-4  flex-col flex bg-gray-100   transition-all duration-700  items-center justify-center ${
                  verified
                    ? "text-green-500"
                    : "text-red-600 hover:text-red-700"
                } ${
                  isVerifing ? "text-gray-400 cursor-wait" : ""
                } transition-all duration-700 `}
                onClick={verifyButtonHandler}
                disabled={disabled || isVerifing}
              >
                {isVerifing ? "Verifying..." : verified ? "Verified" : "Verify"}
              </button>
            ) : (
              type === "password" && (
                <button
                  type="button"
                  className="px-4 text-divider-200"
                  onClick={() => setHide(!hide)}
                  disabled={disabled}
                >
                  {hide ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              )
            )}
          </>
        )}
      </div>
      {error && <p className="text-negative mt-2 capitalize">{error}</p>}
    </div>
  );
};

export default CustomTextInput;
