"use client";

import Image from "next/image";
// import { IoClose } from "react-icons/io5";

import { IoIosCloseCircleOutline } from "react-icons/io";

const Success: React.FC<{
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
              <IoIosCloseCircleOutline size={24} />
            </button>
          </div>
        </div>

        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/icon/happyjar.svg"
              alt="shape"
              width={220}
              height={220}
            />
          </div>

          <div className="text-center space-y-1 mb-6">
            <h1 className="font-bold text-green-500 text-lg">
              Funds Successfully Added to Group Pool
            </h1>
            <p className="text-[12px] text-black">
              You have successfully added UGX 10,000 to group pool savings
            </p>
          </div>

          <div className="bg-transparent rounded-md p-4 space-y-4 text-black">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">
                Group Pool
              </h1>
              <span className="text-black text-[12px]">Contribution</span>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">
                Saving Amount
              </h1>
              <span className="text-black text-[12px]">UGX 1000</span>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">
                Preferred saving method
              </h1>
              <span className="text-black text-[12px]">Weekly</span>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">
                Start Date
              </h1>
              <span className="text-black text-[12px]">22-Jul-2025</span>
            </div>
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-500 text-[12px]">
                Source of Funds
              </h1>
              <span className="text-black text-[12px]">Twezimbe Wallet</span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="px-6 py-4 bg-white">
        <button
          onClick={handleToggleModal}
          className="w-full py-2 bg-primary text-white rounded-md"
        >
          Go Back to Wallet
        </button>
      </div> */}
    </>
  );
};

export default Success;
