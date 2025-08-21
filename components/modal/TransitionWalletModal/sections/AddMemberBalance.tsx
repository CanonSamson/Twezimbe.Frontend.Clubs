"use client";

import { IoClose } from "react-icons/io5";

import CustomBfCurrencyInput from "@/components/input/CustomBfCurrencyInput";
import CustomTextInput from "@/components/input/CustomTextInput";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { useState } from "react";
import { LuInfo } from "react-icons/lu";

const AddMemberBalance: React.FC<{
  next: () => void;
  back: () => void;
  handleToggleModal: () => void;
}> = ({ handleToggleModal, back, next }) => {
  const [amount, setAmount] = useState<string>("");
  const [dateJoined, setDateJoined] = useState<string>("");
  const { modalData, updateModalData } = useSettingModal();
  
  const handleNext = () => {
    updateModalData("transitionWalletModal", { amount, dateJoined });
    next();
  };

  const user = modalData?.transitionWalletModal?.user;

  return (
    <>
      <div className=" max-h-[70vh] w-full overflow-x-auto">
        <div className=" relative ">
          <div className="flex  p-6 flex-col absolute top-0 right-0 w-full mb-4">
            <div className="justify-end flex w-full pb-6">
              <button
                className="text-gray-500 hover:text-gray-700 w-[32px] h-[32px]  flex items-center justify-center bg-white rounded-full"
                onClick={handleToggleModal}
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-start mt-4">
            <h2 className="text-xl font-bold">Input opening balance</h2>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <LuInfo className="text-[#EEA05C] size-4" />
            <h1 className="text-[12px] text-gray-600">
              Use negative values (e.g. -500) to indicate overdrawn balances or debt.
            </h1>
          </div>

          <div className="flex items-center justify-between p-3 mt-6 bg-gray-50 rounded-md">
            <div className="flex items-center gap-4">
              <CustomAvatar
                image={user?.profileImage}
                className="justify-start w-[50px] h-[50px]"
                imageClassName="h-[50px] object-top text-[20px] font-bold text-primary border w-[50px] rounded-[12px] overflow-hidden flex items-center justify-center"
                labelClassName="h-[50px] w-[50px] rounded-[9px] overflow-hidden flex items-center justify-center"
                alt="profile image"
                showText={false}
                disabled={true}
                iconClassName="w-[25px] h-[25px]"
                isCurrentUser={false}
                userFullName={`${user.firstName} ${user.lastName}`}
              />
              <div className="leading-tight">
                <h2 className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-gray-500">@{user?.userName}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CustomBfCurrencyInput
              label="Amount"
              placeholder={"4,000"}
              value={amount}
              type={undefined}
              onChange={(e) => setAmount(e.target.value)}
              id={"amount"}
              allowNegative={true}
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <LuInfo className="text-[#EEA05C] size-4" />
            <h1 className="text-[12px] text-gray-600">
              Use negative values (e.g. -500) to indicate overdrawn balances or debt.
            </h1>
          </div>

          <div className="mt-6">
            <CustomTextInput
              type="date"
              id="dateJoined"
              onChange={(e) => setDateJoined(e.target.value)}
              value={dateJoined}
              label="Date Joined"
              placeholder="select date joined"
              className="font-bold block mb-4 tablet-lg:mb-4"
              inputClassName="bg-divider-100 font-normal"
            />
          </div>
        </div>

        <div className="flex justify-end bg-white p-6 gap-3 mb-2 border-t">
          <button
            className="px-4 py-2 text-primary bg-white rounded-md border border-gray-300 hover:bg-gray-50"
            onClick={back}
          >
            Select Another Member
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700"
            onClick={handleNext}
          >
            Confirm & Add
          </button>
        </div>
      </div>
    </>
  );
};

export default AddMemberBalance;