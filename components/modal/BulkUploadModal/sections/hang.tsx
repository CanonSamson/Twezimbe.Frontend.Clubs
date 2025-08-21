"use client";

import Image from "next/image";

const Hang: React.FC<{
  handleToggleModal: () => void;
}> = ({ handleToggleModal }) => {
  return (
    <>
      <div className=" max-h-[70vh] w-full overflow-x-auto">
        <div className=" relative ">
          <div className="flex  p-6   flex-col   absolute top-0 right-0 w-full mb-4">
            <div className="justify-end flex w-full pb-6"></div>
          </div>
        </div>

        <div className="p-10">
          <div className="flex justify-center mb-10">
            <Image src="/icon/shape.svg" alt="shape" width={80} height={80} />
          </div>

          <div className=" p-0 text-center space-y-2 mb-2">
            <h1 className="font-bold text-black text-xl">Hang in there...</h1>
            <p className="font-inter text-black text-sm">
              Transition wallet for Sule Yahaya has been sent for approval and
              you will be notified once it has been accepted or denied.
            </p>
          </div>
        </div>
      </div>
      <div className="flex bg-white p-3 gap-3 mb-8">
        <button
          className="w-full px-4 py-2 bg-primary text-white"
          onClick={() => handleToggleModal()}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default Hang;
