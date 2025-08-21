import { useSettingModal } from "@/contexts/modal-setting";
import FundDisbursement from "./FundDisbursement";
import FundDisbursementProcessed from "./FundDisbursementProcessed";

const FundDisbursementModal = () => {
  const { modals, modalData, closeModal } = useSettingModal();
  const handleToggleModal = () => {
    closeModal("fundDisbursementModal");
  };

  const state = modalData?.fundDisbursementModal?.state;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 items-center justify-center tablet:justify-center ${
          modals.fundDisbursementModal ? "flex" : "hidden"
        }`}
      >
        <button
          onClick={() => handleToggleModal()}
          className={`w-full  z-0 fixed items-center justify-center h-full bg-black bg-opacity-[75%] ${
            modals.fundDisbursementModal ? "flex" : "hidden"
          }`}
        />

        <div className="relative max-w-lg py-9 px-6 rounded-[10px] bg-[#fdfdfd] font-inter">
          {state && state === 1 ? (
            <FundDisbursement />
          ) : (
            <FundDisbursementProcessed />
          )}
        </div>
      </div>
    </>
  );
};

export default FundDisbursementModal;
