"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { IoMdClose } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";

const LockedBalanceModal = () => {
  const groupId = useParams()?.groupId as string;

  const bfId = useParams()?.bfId as string;
  const router = useRouter();
  const { modals, toggleModal } = useSettingModal();

  //   const data = modalData?.submittedModal;
  //   const router = useRouter();

  const handleClose = () => {
    toggleModal("lockedBalanceModal");
    router.push(`/bf/settings/${groupId}/${bfId}/transition-wallet`);
  };
  return (
    <div
      className={`${
        modals.lockedBalanceModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-30`}
    >
      <div className="bg-white w-full max-w-[450px]  rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6  relative">
        <button
          onClick={() => handleClose()}
          className="absolute top-4 right-4 text-divider-200"
        >
          {/* <IoMdClose size={24} /> */}
        </button>
        <div className="flex flex-col items-center mt-8">
          <Image
            src="/icon/Group 42.svg"
            alt="Group42"
            width={128}
            height={128}
            className="mb-4 "
          />
          <h1 className="text-2xl font-bold mb-2">Opening Balance Submited</h1>
          <p className="text-center mb-4 text-[12px]">
            Your Transition wallet is being populated and sent to respective
            members of the fund for approval. Once they have approved, their
            balance will be locked
          </p>
          <div className="w-full rounded-md">
            <button
              onClick={() => handleClose()}
              className="w-full flex items-center justify-center bg-primary text-white px-9 py-6 mt-4"
            >
              <div className="flex items-center gap-2">
                {/* <Image src="/icon/Text.svg" alt="Text" width={30} height={30} /> */}
                <span className="font-inter text-[14px]">Close</span>
              </div>
              {/* <Image src="/icon/Union.svg" alt="Union" width={12} height={12} /> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedBalanceModal;
