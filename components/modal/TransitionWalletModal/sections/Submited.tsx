"use client";

import Image from "next/image";

const Submited: React.FC<{
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
            <Image
              src="/icon/Group 42.svg"
              alt="shape"
              width={120}
              height={120}
            />
          </div>

          <div className="text-center space-y-1">
            <h1 className="font-bold text-black text-lg">
              Opening Balance Submitted
            </h1>
            <p className="text-black text-sm">
              The opening balance has been sent to James Mark for approval and
              you will be notified once it has been accepted or denied.
            </p>
          </div>
        </div>
      </div>

      <div className="flex p-4 bg-white mx-10 mb-4">
        <button
          className="flex-1 py-2 bg-primary text-white rounded-none"
          onClick={handleToggleModal}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default Submited;
