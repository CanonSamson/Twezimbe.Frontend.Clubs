"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import Access from "./sections/Access";
import Added from "./sections/Added";
import { useState } from "react";

const DetailsEditModal = () => {
  const { modals, toggleModal } = useSettingModal();
  const [step, setStep] = useState(1);
  // pushh
  const next = () => setStep((prev) => prev + 1);

  const handleToggleModal = () => {
    toggleModal(" bulkUploadModal");
    setStep(1);
  };

  const detailsEditModal = modals.detailsEditModal;

  return (
    <>
      <div
        className={`${
          detailsEditModal ? " flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            detailsEditModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-full max-w-[400px] font-inter rounded-lg rounded-bl overflow-hidden shadow-lg">
          {step === 1 && (
            <Access handleToggleModal={handleToggleModal} next={next} />
          )}

          {step === 2 && <Added handleToggleModal={handleToggleModal} />}
        </div>
      </div>
    </>
  );
};

export default DetailsEditModal;
