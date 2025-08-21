import React, { useState } from "react";
import Image from "next/image";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomTextInput from "../input/CustomTextInput";
import CustomSelect from "../input/CustomSelect";
import { beneficiaryMethodOptions } from "@/utils/data/beneficiary";

const Select1Svg = "/assets/images/icons/select1.svg";

const SelectModal = () => {
  const { toggleModal, modals } = useSettingModal();
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      toggleModal("selectModal");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        modals.selectModal ? "flex" : "hidden"
      }`}
    >
     
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={() => toggleModal("selectModal")}
      />

      <div className="relative bg-[#F9F9F9] w-full max-w-5xl rounded-lg shadow-lg">
       
        <div className="grid grid-cols-1 lg:grid-cols-2">
       
          <div className="hidden lg:flex flex-col justify-center bg-white text-black p-8 rounded-l-lg">
            <div className="flex flex-col items-center text-center">
           
              <div className="relative w-48 h-48 bg-white flex items-center justify-center mt-4">
                <Image
                  src={Select1Svg}
                  width={200}
                  height={200}
                  alt="Auth Icon"
                />
              </div>
              <h2 className="text-4xl font-black leading-tight -mt-2">
                Connect Grow.
              </h2>
              <p className="text-lg opacity-75 max-w-md">
                Simplify operations, boost transparency, and empower your
                community with our all-in-one fund management solution.
              </p>
            </div>
          </div>

          
          <div className="flex flex-col justify-center p-6 bg-[#F4F4F4]">
            <div className="max-w-sm mx-auto w-full">
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <p>Let&apos;s go!</p>
                    <h1>One more thing!</h1>
                  </div>
                  <CustomTextInput
                    type="text"
                    id="Name1"
                    value=""
                    label="Name"
                    showStar={true}
                    placeholder="enter name"
                    className="font-bold"
                    inputClassName="bg-divider-100 font-normal"
                  />
                  <CustomSelect
                    selectTriggerClassName="bg-divider-100 font-normal"
                    label="Relationship"
                    options={beneficiaryMethodOptions}
                    placeholder="select"
                    showStar={true}
                    value=""
                    className="font-bold"
                  />
                  <CustomTextInput
                    type="text"
                    id="Name2"
                    value=""
                    label="Name"
                    showStar={true}
                    placeholder="enter name"
                    className="font-bold"
                    inputClassName="bg-divider-100 font-normal"
                  />
                  <div className="flex justify-start mt-6">
                    <button
                      onClick={handleNext}
                      className="font-medium text-[12px] w-full px-4 py-2 text-lg text-white bg-primary rounded-md border border-[#1D1C1D21] hover:bg-gray-300 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  
                  <CustomTextInput
                    type="text"
                    id="Name3"
                    value=""
                    label="Name"
                    showStar={true}
                    placeholder="enter name"
                    className="font-bold"
                    inputClassName="bg-divider-100 font-normal"
                  />
                  <CustomSelect
                    selectTriggerClassName="bg-divider-100 font-normal"
                    label="Relationship"
                    options={beneficiaryMethodOptions}
                    placeholder="select"
                    showStar={true}
                    value=""
                    className="font-bold"
                  />
                  <CustomTextInput
                    type="text"
                    id="Name4"
                    value=""
                    label="Name"
                    showStar={true}
                    placeholder="enter name"
                    className="font-bold"
                    inputClassName="bg-divider-100 font-normal"
                  />
                  <div className="flex justify-start mt-6">
                    <button
                      onClick={handleNext}
                      className="font-medium text-[12px] w-full px-4 py-2 text-lg text-white bg-primary rounded-md border border-[#1D1C1D21] hover:bg-gray-300 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              <div className="flex text-center justify-center mt-6">
                <button
                  onClick={handleBack}
                  className="font-medium text-[12px] w-full px-4 py-2 text-lg text-primary underline"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectModal;
