"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomTextarea from "@/components/input/CustomTextarea";
// import { useSettingModal } from "@/contexts/modal-setting";

const Transition: React.FC<{
  next: () => void;
  handleToggleModal: () => void;
}> = ({ handleToggleModal, next }) => {
  // const { modalData, updateModalData } = useSettingModal();

  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleNext = () => {
    if (!reason.trim()) {
      setError("Please provide a reason before proceeding.");
      return;
    }

    next();
  };

  return (
    <>
      <div className=" max-h-[70vh] w-full overflow-x-auto">
        <div className=" relative ">
          <div className="flex  p-6   flex-col   absolute top-0 right-0 w-full mb-4">
            <div className="justify-end flex w-full pb-6">
              <button
                className="text-gray-500 hover:text-gray-700 w-[32px] h-[32px]  flex items-center justify-center bg-white rounded-full"
                onClick={handleToggleModal}
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-start">
            <h2 className="text-xl font-bold">Reason for declining balance</h2>
            <p className="text-[14px] text-divider-200 mb-6">
              Upload any document showing proof of the reason you have given for
              declining your opening balance
            </p>
          </div>

          <CustomTextarea
            id="reason"
            value={reason}
            label="Reason"
            placeholder="E.g. Balance is incorrect"
            className="mt-4"
            textareaClassName="bg-divider-100 text-start w-full"
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-end bg-white p-3 gap-3">
          <button
            className="px-8 py-2 text-primary bg-white rounded-md border border-gray-600"
            onClick={handleToggleModal}
          >
            Cancel
          </button>
          <button
            className="px-8 py-2 bg-primary text-white rounded-md"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Transition;
