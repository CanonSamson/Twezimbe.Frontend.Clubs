"use client";

import Image from "next/image";

const Sent: React.FC<{
  handleToggleModal: () => void;
}> = ({ handleToggleModal }) => {
  return (
    <>
      <div className="max-h-[40vh] w-full overflow-y-auto">
        <div className="relative">
          <div className="absolute top-0 right-0 p-4 flex justify-end w-full"></div>
        </div>

        <div className="px-6 py-8">
          <div className="flex justify-center mb-4">
            <Image src="/icon/sent.svg" alt="shape" width={120} height={120} />
          </div>

          <div className="text-center space-y-1">
            <h1 className="font-bold text-black text-lg">
              Withdrawal Request Sent
            </h1>
            <p className="text-[12px] text-black mb-6 text-center line-clamp-2">
              Your request for the withdrawal of UGX 10,000 from group pool has
              been sent and under review. Check withdrawal tracking on your
              dashboard for update.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full p-4 bg-white mb-4">
        <button
          className="w-full py-2 bg-primary text-white rounded-lg"
          onClick={handleToggleModal}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default Sent;
