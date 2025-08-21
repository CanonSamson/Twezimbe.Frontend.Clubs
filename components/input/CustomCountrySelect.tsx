"use client";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface CustomCountrySelectProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: string | undefined | false;
  selectTriggerClassName?: string;
  showStar?: boolean;
  id?: string;
  disabled?: boolean;
}

const CustomCountrySelect: React.FC<CustomCountrySelectProps> = ({
  error,
  className,
  label,
  onChange,
  selectTriggerClassName,
  value,
  showStar,
  disabled = false
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label>
          {label} <span className="text-red-600">{showStar && "*"}</span>
        </label>
      )}
      <div
        className={` flex border rounded-[10px] border-divider mt-[2px]  relative  h-[50px]  ${selectTriggerClassName} ${disabled? " opacity-50": ""}`}
      >
        <PhoneInput
          country={"ug"}
          value={value}
          onChange={onChange}
          containerClass={`react-tel-input`}
          inputStyle={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
          }}
          buttonStyle={{
            backgroundColor: "transparent",
            border: "none",
            paddingLeft: "10px",
          }}
          dropdownStyle={{}}
          inputClass="form-control "
          buttonClass="flag-dropdown "
          dropdownClass="dropdown "
          inputProps={{
            name: "phone",
            required: true,
            disabled: disabled,
          }}
        />
      </div>
      {error && <p className="text-negative mt-2 capitalize">{error}</p>}
    </div>
  );
};

export default CustomCountrySelect;
