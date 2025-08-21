import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";


const Done: React.FC = () => {
  const { closeModal } = useSettingModal();

  const handleClose = () => closeModal("walletWithdrawalModal");
  return (
    <div className="bg-white w-full max-w-[500px]  rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6  relative">
      <button
        onClick={() => handleClose()}
        className="absolute top-4 right-4 text-divider-200"
      >
        <IoMdClose size={24} />
      </button>
      <div className="flex flex-col items-center mt-8">
        <Image
          src="/icon/Group 42.svg"
          alt="Group42"
          width={128}
          height={128}
          className="mb-4 "
        />
        <h1 className="text-2xl font-bold mb-2">
          Withdrawal is being processed
        </h1>
        <p className="text-center mb-4 text-[12px]">
          Your request is being processed and will be completed shortly. you
          will be notified once this is complete.
          <br />
        </p>
        <div className="w-[400px] flex items-center justify-center">
          <button
            onClick={() => handleClose()}
            className="w-full flex items-center rounded-md justify-center bg-primary text-white px-6 py-3 mt-2 mb-6"
          >
            <h1 className="">Close</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Done;
