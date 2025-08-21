"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import Access from "./sections/Access";
import Added from "./sections/Added";


const CustomRoleModal = () => {
  const { modals, closeModal, modalData } = useSettingModal();

  const customRoleModal = modals.customRoleModal;

  const step = modalData?.customRoleModal?.step || 1;
  const handleToggleModal = () => {
    closeModal("customRoleModal");
  
  };

  return (
    <>
      <div
        className={`${
          customRoleModal ? " flex" : "hidden"
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            customRoleModal ? "flex" : "hidden"
          }`}
        />

        <div className="bg-white z-20 duration-500 transition-all relative w-full max-w-[460px] font-inter rounded-lg rounded-bl overflow-hidden shadow-lg">
          
          {step === 1 && (
            <Access
              handleToggleModal={handleToggleModal}
            
            />
          )}
          {step === 32 && (
            <Added
              handleToggleModal={handleToggleModal}
            />
          )}
         
        </div>
      </div>
    </>
  );
};

export default CustomRoleModal;
