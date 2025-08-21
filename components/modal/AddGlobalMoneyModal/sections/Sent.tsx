"use client";

import Image from "next/image";
import { IoClose } from "react-icons/io5";

const Sent: React.FC<{
  handleToggleModal: () => void;
}> = ({ handleToggleModal }) => {
  return (
    <>
      <div className="max-h-[80vh] w-full overflow-y-auto">
        <div className="relative">
          <div className="absolute top-0 right-0 p-4">
            <button
              className="text-divider-200 hover:text-divider-300 transition-colors duration-200"
              onClick={handleToggleModal}
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-center mb-4">
            <Image src="/icon/bank.svg" alt="shape" width={120} height={120} />
          </div>

          <div className="text-center space-y-1 mb-6">
            <h1 className="font-bold text-black text-lg">
              Your Virtual Account is Ready!
            </h1>
            <p className="text-[12px] text-black">
              Transfers to this account will be credited to your wallet
              instantly.
            </p>
          </div>

          <div className="bg-[#F8F8F8] rounded-md p-4 space-y-2 text-white">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">Name</h1>
              <span className="text-black text-[12px]">John Kiiza</span>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">
                Account Number
              </h1>
              <span className="text-black text-[12px]">0234567890</span>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">Bank</h1>
              <span className="text-black text-[12px]">Pride Bank</span>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">
                Amount
              </h1>
              <span className="text-black text-[12px]">UGX 10,000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-white">
        <button
          onClick={handleToggleModal}
          className="w-full py-2 bg-primary text-white rounded-md"
        >
          Go Back to Wallet
        </button>
      </div>
    </>
  );
};

export default Sent;
