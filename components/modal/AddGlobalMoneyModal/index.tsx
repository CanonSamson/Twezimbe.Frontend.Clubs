"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { useState } from "react";
import Select from "./sections/Select";
import Exchange from "./sections/Exchange";
import Fund from "./sections/Fund";
import Hang from "./sections/Hang";
import Transfer from "./sections/Transfer";
import Sent from "./sections/Sent";
import Domiciliary from "./sections/Domiciliary";

const AddGlobalMoneyModal = () => {
  const { modals, toggleModal } = useSettingModal();
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<
    "ugx" | "usd" | null
  >(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "mobile_money" | "debit_credit" | "bank_transfer" | null
  >(null);

  const addGlobalMoneyModal = modals.addGlobalMoneyModal;

  const next = () => {
    if (step === 1 && selectedCurrency === "usd") {
      setStep(2);
    } else if (step === 1 && selectedCurrency === "ugx") {
      setStep(3);
    } else if (step === 3 && selectedPaymentMethod === "bank_transfer") {
      if (selectedCurrency === "usd") {
        setStep(7);
      } else {
        setStep(5);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  //   const back = () => {
  //     if (step === 3 && selectedCurrency === "usd") {
  //       setStep(2);
  //     } else if (step === 4) {
  //       setStep(3);
  //     } else if (step === 7) {
  //       setStep(3);
  //     } else {
  //       setStep((prev) => prev - 1);
  //     }
  //   };

  const handleToggleModal = () => {
    toggleModal("addGlobalMoneyModal");
    setStep(1);
    setSelectedCurrency(null);
    setSelectedPaymentMethod(null);
  };

  return (
    <>
      <div
        className={`${
          addGlobalMoneyModal ? "flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            addGlobalMoneyModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-[440px] font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg">
          {step === 1 && (
            <Select
              handleToggleModal={handleToggleModal}
              next={next}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
            />
          )}
          {step === 2 && <Exchange next={next} />}
          {step === 3 && (
            <Fund
              handleToggleModal={handleToggleModal}
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
          {step === 7 && <Domiciliary handleToggleModal={handleToggleModal} />}
        </div>
      </div>
    </>
  );
};

export default AddGlobalMoneyModal;
