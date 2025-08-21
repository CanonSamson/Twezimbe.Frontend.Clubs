"use client";

import Image from "next/image";

interface HangProps {
  handleToggleModal: () => void;
}

const Hang: React.FC<HangProps> = ({ handleToggleModal }) => {
  return (
    <div className="flex flex-col">
      <div className="max-h-[40vh] w-full overflow-y-auto">
        <div className="relative">
          <div className="absolute top-0 right-0 p-4 flex justify-end w-full"></div>
        </div>

        <div className="px-6 py-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/icon/Group 42.svg"
              alt="shape"
              width={120}
              height={120}
            />
          </div>

          <div className="text-center space-y-1">
            <h1 className="font-bold text-black text-lg">Feedback sent</h1>
            <p className="text-black text-sm">
              Your feedback has been sent to admin for review and will be
              updated accordingly
            </p>
          </div>
        </div>
      </div>

      <div className="flex p-4 bg-white mb-4">
        <button
          className="w-full py-3 bg-primary text-white rounded-none"
          onClick={handleToggleModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Hang;
