"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import AddManual from "./sections/AddManual";
import AddMembers from "./sections/AddMembers";
import { X } from "lucide-react";
import Image from "next/image";
import AddRelationship from "./sections/AddRelationship";

const AddBeneficiaryModal = () => {
  const { modalData, toggleModal, modals } = useSettingModal();

  const data = modalData?.addBeneficiaryModal;
  const state = modalData?.addBeneficiaryModal?.state;

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        modals?.addBeneficiaryModal ? "flex" : "hidden"
      } items-end tablet-lg:items-center justify-center`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => toggleModal("addBeneficiaryModal")}
      />

      <div
        className="w-full max-w-full tablet-lg:w-full tablet-lg:max-w-[450px] z-[101]
               max-h-[90vh] overflow-y-auto"
      >
        <div className="flex flex-col w-full h-full tablet-lg:h-auto">
          <div className="flex flex-col p-4 bg-white rounded-t-[18px] w-full tablet-lg:rounded-[10px] mb-auto tablet-lg:mb-0">
            <div className="flex justify-end px-4 tablet-lg:px-0">
              <Image
                src="/icon/bar.svg"
                alt="gray-bar"
                width={70}
                height={70}
                className="mb-0 relative bottom-2 mx-auto block tablet-lg:hidden"
              />
              <button
                onClick={() => toggleModal("addBeneficiaryModal")}
                className="rounded-full p-1 hidden tablet-lg:block"
              >
                <X className="size-[24px] text-black" />
              </button>
            </div>

            <div className="w-full ">
              {state === 1 ? (
                <>{data?.manual === true ? <AddManual /> : <AddMembers />}</>
              ) : (
                <AddRelationship />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBeneficiaryModal;
