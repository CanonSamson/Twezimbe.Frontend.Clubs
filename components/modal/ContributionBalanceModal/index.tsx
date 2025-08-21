"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useState } from "react";
import Contribution from "./sections/Contribution";
import Sent from "./sections/Sent";
// import Pool from "./sections/Pool";
// import Funds from "./sections/Funds";
// import Success from "./sections/Success";

// import UploadMembershipProve from "./sections/UploadMembershipProve";

// import Transition from "./sections/Transition";
// import ConfirmMemberDetails from "./sections/ConfirmMemberDetails";

// import AddMemberBalance from "./sections/AddMemberBalance";
// import GroupInvite from "./sections/GroupInvite";
// import Members from "./sections/Members";
// import Submited from "./sections/Submited";

const ContributionBalanceModal = () => {
  const { modals, toggleModal } = useSettingModal();

  const [step, setStep] = useState(1);
  const contributionBalanceModal = modals.contributionBalanceModal;

  const next = () => setStep((prev) => prev + 1);
  // const back = () => setStep((prev) => prev - 1);

  const handleToggleModal = () => {
    toggleModal("contributionBalanceModal");
    setStep(1);
  };

  return (
    <>
      <div
        className={`${
          contributionBalanceModal ? " flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            contributionBalanceModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-full max-w-[460px]  font-inter rounded-lg overflow-hidden shadow-lg">
          {/* {step === 1 && (
            <GroupInvite next={next} handleToggleModal={handleToggleModal} />
          )} */}
          {step === 1 && (
            <Contribution
              handleToggleModal={handleToggleModal}
              //   back={back}
              next={next}
            />
          )}
          {step === 2 && (
            <Sent
              handleToggleModal={handleToggleModal}
              //   back={back}
              //   next={next}
            />
          )}
          {/*{step === 3 && (
            <Success
              handleToggleModal={handleToggleModal}
              //   back={back}
              //   next={next}
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
          {step === 7 && <Submited handleToggleModal={handleToggleModal} />} */}
        </div>
      </div>
    </>
  );
};

export default ContributionBalanceModal;
