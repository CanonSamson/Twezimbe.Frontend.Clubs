"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useState } from "react";

import UploadMembershipProve from "./sections/UploadMembershipProve";

import Transition from "./sections/Transition";
import ConfirmMemberDetails from "./sections/ConfirmMemberDetails";

import AddMemberBalance from "./sections/AddMemberBalance";
// import GroupInvite from "./sections/GroupInvite";
import Members from "./sections/Members";
import Submited from "./sections/Submited";

const TransitionWalletModal = () => {
  const { modals, toggleModal } = useSettingModal();

  const [step, setStep] = useState(1);
  const transitionWalletModal = modals.transitionWalletModal;

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleToggleModal = () => {
    toggleModal("transitionWalletModal");
    setStep(1);
  };

  return (
    <>
      <div
        className={`${
          transitionWalletModal ? " flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            transitionWalletModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-full max-w-[460px] h-[70vh] tablet-lg:h-[70vh] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg">
          {/* {step === 1 && (
            <GroupInvite next={next} handleToggleModal={handleToggleModal} />
          )} */}
          {step === 1 && (
            <Members
              handleToggleModal={handleToggleModal}
              back={back}
              next={next}
            />
          )}
          {step === 2 && (
            <AddMemberBalance
              handleToggleModal={handleToggleModal}
              back={back}
              next={next}
            />
          )}
          {step === 3 && (
            <UploadMembershipProve
              handleToggleModal={handleToggleModal}
              back={back}
              next={next}
            />
          )}
          {step === 4 && (
            <Transition
              handleToggleModal={handleToggleModal}
              back={back}
              next={next}
            />
          )}
          {step === 6 && (
            <ConfirmMemberDetails
              back={back}
              next={next}
              handleToggleModal={handleToggleModal}
            />
          )}
          {step === 7 && <Submited handleToggleModal={handleToggleModal} />}
        </div>
      </div>
    </>
  );
};

export default TransitionWalletModal;
