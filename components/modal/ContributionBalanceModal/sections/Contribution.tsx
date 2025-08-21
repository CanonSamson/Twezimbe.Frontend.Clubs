"use client";

import CustomTextInput from "@/components/input/CustomTextInput";
import Image from "next/image";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { LuInfo } from "react-icons/lu";

const Contribution: React.FC<{
  handleToggleModal: () => void;
  next: () => void;
}> = ({ handleToggleModal, next }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [preferenceError, setPreferenceError] = useState("");
  const [amount, setAmount] = useState("");
  const [amountTouched, setAmountTouched] = useState(false);

  const cards = [
    {
      id: "card",
      src: "/icon/orangecard.svg",
      label: "Linked Bank Account",
      labelColor: "text-secondary",
    },
    {
      id: "mobile",
      src: "/icon/ashcard.svg",
      label: "Mobile Money",
      labelColor: "text-black",
    },
  ];

  const handleSubmit = () => {
    setPreferenceError("");

    if (!selected) {
      setPreferenceError("Please select a source of funds");
      return;
    }

    next();
  };
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
          <div className="flex justify-center mb-4 gap-4">
            <Image src="/icon/purse.svg" alt="purse" width={20} height={20} />
            <h1>My Contribution Balance</h1>
          </div>
          <div className="flex justify-center">
            <p>UGX 129,000.00</p>
          </div>

          <div className="text-start space-y-1 mb-6">
            <CustomTextInput
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setAmountTouched(true)}
              label="Amount to withdraw"
              placeholder="UGX 500,000"
              className="mt-4"
            />
          </div>

          {amountTouched && (
            <div className="bg-transparent rounded-md p-4 space-y-4 text-black">
              <div>
                <h1 className="mb-3">Withdrawal Account</h1>
                <div className="w-full flex justify-start items-center gap-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={`relative cursor-pointer border rounded-lg p-1 ${
                        selected === card.id
                          ? "border-primary"
                          : preferenceError
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                      onClick={() => {
                        setSelected(card.id);
                        setPreferenceError("");
                      }}
                    >
                      <Image
                        src={card.src}
                        alt={card.label}
                        width={130}
                        height={130}
                      />
                      <span
                        className={`absolute inset-0 flex items-center justify-center font-bold text-xs whitespace-nowrap ${card.labelColor}`}
                      >
                        {card.label}
                      </span>
                      {selected === card.id && (
                        <div className="absolute top-1 right-1 bg-blue-300 rounded-md border border-gray-400 w-5 h-5 flex items-center justify-center">
                          <FaCheck className="text-primary text-xs" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {preferenceError && (
                  <p className="text-red-500 text-sm mt-2">{preferenceError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 text-black rounded-md p-2 mb-4">
                <LuInfo className="text-primary" />
                <span className="text-xs text-primary">
                  Transaction fee is applicable
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {amountTouched && (
        <div className="px-6 py-4 bg-white">
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-primary text-white rounded-md"
          >
            Request Withdrawal
          </button>
        </div>
      )}
    </>
  );
};

export default Contribution;
