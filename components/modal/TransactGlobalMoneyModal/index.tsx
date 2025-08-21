"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useState } from "react";
import Fund from "./sections/Fund";
import Hang from "./sections/Hang";
// import Select from "./sections/Select";
// import Exchange from "./sections/Exchange";
// import Fund from "./sections/Fund";
// import Hang from "./sections/Hang";
// import Transfer from "./sections/Transfer";
// import Sent from "./sections/Sent";
// import Domiciliary from "./sections/Domiciliary";

const TransactGlobalMoneyModal = () => {
  const { modals, toggleModal } = useSettingModal();
  const [step, setStep] = useState(1);
  //   const [selectedCurrency, setSelectedCurrency] = useState<
  //     "ugx" | "usd" | null
  //   >(null);
  //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
  //     "mobile_money" | "debit_credit" | "bank_transfer" | null
  //   >(null);

  const transactGlobalMoneyModal = modals.transactGlobalMoneyModal;

  const next = () => {
    setStep((prev) => prev + 1);
  };

  //   const back = () => {
  //     setStep((prev) => prev - 1);
  //   };

  const handleToggleModal = () => {
    toggleModal("transactGlobalMoneyModal ");
    setStep(1);
  };

  return (
    <>
      <div
        className={`${
          transactGlobalMoneyModal ? "flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            transactGlobalMoneyModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-[440px] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg">
          {step === 1 && (
            <Fund handleToggleModal={handleToggleModal} next={next} />
          )}
          {step === 2 && <Hang handleToggleModal={handleToggleModal} />}
          {/* {step === 3 && (
            <Fund
              handleToggleModal={handleToggleModal}
              back={back}
              next={next}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              isFromExchange={selectedCurrency === "usd"}
            />
          )}
          {step === 4 && <Hang handleToggleModal={handleToggleModal} />}
          {step === 5 && (
            <Transfer handleToggleModal={handleToggleModal} next={next} />
          )}
          {step === 6 && <Sent handleToggleModal={handleToggleModal} />}
          {step === 7 && (
            <Domiciliary handleToggleModal={handleToggleModal} next={next} />
          )} */}
        </div>
      </div>
    </>
  );
};

export default TransactGlobalMoneyModal;
