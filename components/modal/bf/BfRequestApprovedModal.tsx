"use client";
import { useSettingModal } from "@/contexts/modal-setting";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

const BfRequestApprovedModal = () => {
  const { modals, modalData, closeModal } = useSettingModal();
  const data = modalData?.bfRequestApprovedModal as {
    bfName: string;
    fundId: string;
    permission: string;
    groupId: string;
  };
  const router = useRouter();

  return (
    <div
      onClick={() => closeModal("bfRequestApprovedModal")}
      className={`${
        modals.bfRequestApprovedModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-[55]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto max-w-tablet z-10 p-6 tablet:mx-auto mx-4 custom-modal"
      >
        <button
          onClick={() => closeModal("bfRequestApprovedModal")}
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
          <h1 className="text-2xl font-bold mb-2">
            Your request has been approved
          </h1>
          <p className="text-center mb-4 text-[12px]">
            Your Request to Join <strong>{data?.bfName}</strong> Fund has been
            approved.
            <br />
          </p>
          <div className="w-full flex items-center justify-center">
            <button
              onClick={() => {
                router.push(`/bf/${data?.groupId}/${data?.fundId}/principal`);
                closeModal("bfRequestApprovedModal");
              }}
              className="w-full flex items-center rounded-md justify-center bg-primary text-white px-6 py-3 mt-2 mb-6"
            >
              <h1 className="">Continue</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BfRequestApprovedModal;
