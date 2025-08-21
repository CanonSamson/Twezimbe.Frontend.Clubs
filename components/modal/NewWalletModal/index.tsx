"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useState } from "react";
// import Activate from "./sections/Activate";
import Input from "./sections/Input";
// import Currency from "./sections/Currency";
import Hang from "./sections/Hang";

// import Upload from "./sections/Upload";
// import Document from "./sections/Document";
// import Transition from "./sections/Transition";
// import Confirm from "./sections/Confirm";
// import Hang from "./sections/Hang";
// import Input from "./sections/Input";
// import Balance from "./sections/Balance";

const NewWalletModal = () => {
  const { modals, toggleModal } = useSettingModal();

  const [step, setStep] = useState(1);
  const newWalletModal = modals.newWalletModal;

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleToggleModal = () => {
    toggleModal("newWalletModal");
    setStep(1);
  };

  return (
    <>
      <div
        className={`${
          newWalletModal ? "max-tablet-lg:hidden flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            newWalletModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-[440px] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg">
          {/* {step === 1 && (
            <Activate next={next} handleToggleModal={handleToggleModal} />
          )} */}
          {step === 1 && (
            <Input
              handleToggleModal={handleToggleModal}
              back={back}
              next={next}
            />
          )}
          {step === 2 && <Hang handleToggleModal={handleToggleModal} />}
          {/* {step === 4 && <Hang handleToggleModal={handleToggleModal} />} */}
        </div>
      </div>
    </>
  );
};

export default NewWalletModal;
