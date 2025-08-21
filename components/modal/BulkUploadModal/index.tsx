"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useState } from "react";
import Bulk from "./sections/bulk";
// import Hang from "./sections/hang";

const BulkUploadModal = () => {
  const { modals, toggleModal } = useSettingModal();

  const [step, setStep] = useState(1);
  const bulkUploadModal = modals.bulkUploadModal;

  // const next = () => setStep((prev) => prev + 1);

  const handleToggleModal = () => {
    toggleModal(" bulkUploadModal");
    setStep(1);
  };

  return (
    <>
      <div
        className={`${
          bulkUploadModal ? "flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            bulkUploadModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-[540px] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg">
          {step === 1 && <Bulk handleToggleModal={handleToggleModal} />}

          {/* {step === 2 && <Hang handleToggleModal={handleToggleModal} />} */}
        </div>
      </div>
    </>
  );
};

export default BulkUploadModal;
