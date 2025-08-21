"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";

import { IoMdClose } from "react-icons/io";

const PrincipalInvitedModal = () => {
  const { modals, closeModal } = useSettingModal();

  const handleClose = () => {
    closeModal("principalInvitedModal");
  };

  return (
    <div
      className={`${
        modals.principalInvitedModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-30`}
    >
      <div className="bg-white w-full max-w-[500px]  rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6  relative">
        <button
          onClick={() => handleClose()}
          className="absolute top-4 right-4 text-divider-200"
        >
          <IoMdClose size={24} />
        </button>
        <div className="flex flex-col items-center mt-8">
          <Image
            src="/icon/Group 42.svg"
            alt="Group42"
            width={128}
            height={128}
            className="mb-4 "
          />
          <h1 className="text-2xl font-bold mb-2">User Has Been Invited</h1>
          <p className="text-center mb-4 text-[12px]">
            The invitation has been successfully sent to the user. They will
            receive a notification and can accept or decline the invitation to
            join this Benevolent Fund as a principal member.
            <br />
            {/* <span className="relative top-3">
              Your case reference is: {data?.reference}
            </span> */}
          </p>
          <div className="w-full">
            <button
              onClick={() => handleClose()}
              className="w-full flex items-center justify-center bg-primary text-white px-9 py-6 mt-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center">Close</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalInvitedModal;
