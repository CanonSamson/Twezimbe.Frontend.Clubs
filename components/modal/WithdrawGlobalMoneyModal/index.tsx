"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useState } from "react";
import Withdraw from "./sections/Withdraw";
import Confirm from "./sections/Confirm";
import Hang from "./sections/Hang";

const WithdrawGlobalMoneyModal = () => {
  const { modals, toggleModal } = useSettingModal();
  const [step, setStep] = useState(1);

  const withdrawGlobalMoneyModal = modals.withdrawGlobalMoneyModal;

  const next = () => {
    setStep((prev) => prev + 1);
  };

  const handleToggleModal = () => {
    toggleModal("withdrawGlobalMoneyModal");
    setStep(1);
  };

  return (
    <>
      <div
        className={`${
          withdrawGlobalMoneyModal ? "flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            withdrawGlobalMoneyModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-[440px] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg">
          {step === 1 && (
            <Withdraw handleToggleModal={handleToggleModal} next={next} />
          )}
          {step === 2 && (
            <Confirm handleToggleModal={handleToggleModal} next={next} />
          )}
          {step === 3 && <Hang handleToggleModal={handleToggleModal} />}
        </div>
      </div>
    </>
  );
};

export default WithdrawGlobalMoneyModal;
