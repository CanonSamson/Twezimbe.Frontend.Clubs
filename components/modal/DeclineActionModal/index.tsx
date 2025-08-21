"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useEffect, useState } from "react";
import Hang from "./sections/Hang";
import Transition from "./sections/Transition";
import Upload from "./sections/Upload";

interface DeclineActionModalProps {
  onComplete: () => void;
  isRejecting: boolean;
}

const DeclineActionModal = ({
  onComplete,
  isRejecting,
}: DeclineActionModalProps) => {
  const { modals, closeModal, modalData } = useSettingModal();
  const [step, setStep] = useState(1);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleCloseModal = () => {
    closeModal("declineActionModal");
  };

  const isDeclined = !!modalData?.declineActionModal?.isDeclined || false;

  useEffect(() => {
    if (isDeclined) {
      setStep(3);
    }
  }, [isDeclined]);

  return (
    <div
      className={`fixed inset-0 bg-black/30 items-center justify-center z-30 transition-opacity duration-300 ${
        modals.declineActionModal ? "flex opacity-100" : "hidden opacity-0"
      }`}
    >
      <div className="bg-white w-full max-w-[440px] rounded-lg rounded-bl-none overflow-hidden shadow-lg transform transition-transform duration-300">
        {step === 1 && (
          <Transition next={next} handleToggleModal={handleCloseModal} />
        )}
        {step === 2 && (
          <Upload
            handleToggleModal={handleCloseModal}
            back={back}
            next={next}
            onComplete={onComplete}
            isRejecting={isRejecting}
          />
        )}
        {step === 3 && <Hang handleToggleModal={handleCloseModal} />}
      </div>
    </div>
  );
};

export default DeclineActionModal;
