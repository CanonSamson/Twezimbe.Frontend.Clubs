"use client";

import Image from "next/image";

const Exchange: React.FC<{
  next: () => void;
}> = ({ next }) => {
  return (
    <>
      <div className="max-h-[60vh] w-full overflow-y-auto">
        <div className="relative">
          <div className="absolute top-0 right-0 p-4 flex justify-end w-full"></div>
        </div>

        <div className="px-6 py-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/icon/Exchange.svg"
              alt="shape"
              width={120}
              height={120}
            />
          </div>

          <div className="space-y-6">
            <h1 className="font-bold text-black text-lg text-center">
              About Exchange Rates
            </h1>

            <div className="border border-gray-400 rounded-md p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">UGX Buy Rate</span>
                <span className="font-mono">USD 0.00028</span>
              </div>
              <p className="text-sm text-gray-600">
                You&apos;re funding at this rate
              </p>
            </div>

            <div className="border border-gray-400 rounded-md p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">UGX Sell Rate</span>
                <span className="font-mono">USD 0.00025</span>
              </div>
              <p className="text-sm text-gray-600">
                You&apos;re withdrawing at this rate
              </p>
            </div>
          </div>

          <h1 className="text-[12px] text-gray-600 mb-6 text-center line-clamp-3 mt-6">
            <span className="text-gray-900 font-bold text-[15px]">
              Disclaimer:
            </span>{" "}
            Exchange rates shown here are supplied by independent providers who
            manage fund conversions using current parallel market rates.
            Twezi does not determine or control these rates, and they may
            fluctuate based on market conditions.
          </h1>
        </div>
      </div>

      <div className="flex p-4 bg-white mx-10 mb-4">
        <button
          className="flex-1 py-4 bg-primary text-white rounded-none"
          onClick={next}
        >
          Accept & Continue
        </button>
      </div>
    </>
  );
};

export default Exchange;
