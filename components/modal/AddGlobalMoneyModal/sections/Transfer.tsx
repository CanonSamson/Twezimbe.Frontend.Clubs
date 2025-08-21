"use client";

import Image from "next/image";
import { IoClose } from "react-icons/io5";

const Transfer: React.FC<{
  handleToggleModal: () => void;
  next: () => void;
}> = ({ handleToggleModal, next }) => {
  return (
    <>
      <div className="max-h-[40vh] w-full overflow-y-auto">
        <div className="relative">
          <div className="absolute top-0 right-0 p-4 flex justify-end w-full">
            <button
              className="text-divider-200 hover:text-divider-300 transition-colors duration-200"
              onClick={handleToggleModal}
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="flex justify-center mb-4">
            <Image src="/icon/bank.svg" alt="shape" width={120} height={120} />
          </div>

          <div className="text-center space-y-1">
            <h1 className="font-bold text-black text-lg">
              Claim Virtual Wallet
            </h1>
            <p className="text-[12px] text-black mb-6 text-center line-clamp-2">
              Request for a virtual account number with our partner banks to
              allow for a seamless transaction
            </p>
          </div>
        </div>
      </div>

      <div className="flex p-4 bg-white mx-10 mb-4">
        <button
          className="flex-1 py-2 bg-primary text-white rounded-none"
          onClick={next}
        >
          Request account number
        </button>
      </div>
    </>
  );
};

export default Transfer;
