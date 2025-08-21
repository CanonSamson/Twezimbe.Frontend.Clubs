"use client";

import Image from "next/image";
import { useSettingModal } from "@/contexts/modal-setting";

const AcceptActionModal = () => {
  const { modals, closeModal } = useSettingModal();

  return (
    <div
      className={`${
        modals.acceptActionModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-30`}
    >
      <div className="bg-white w-full max-w-[400px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6 relative">
        <div className="flex flex-col items-center mt-8">
          <Image
            src="/icon/Group 42.svg"
            alt="Group42"
            width={128}
            height={128}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">Accepted</h1>
          <p className="text-center mb-4 text-[12px]">
            You have accepted your transition wallet opening balance. This is
            now locked
          </p>
          <div className="w-full">
            <button
              onClick={() => closeModal("acceptActionModal")}
              className="w-full flex items-center justify-center bg-primary text-white px-6 py-3 mt-4"
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptActionModal;
