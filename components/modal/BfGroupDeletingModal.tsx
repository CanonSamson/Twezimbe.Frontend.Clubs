import CustomDialog from "@/components/custom/CustomDialog";
import AuthButton from "@/components/button/AuthButton";
import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";

const BfGroupDeletingModal = () => {
  const { toggleModal } = useSettingModal();
  return (
    <CustomDialog
      close={() => {}}
      name="bfGroupDeletingModal"
      contentClassName="max-w-[450px] py-10 z-[55] bg-white custom-modal"
    >
      <div className="flex flex-col items-center text-center p-0">
        <div className="mb-4 w-[200px] h-[200px] bg-[#C3DBEC] rounded-full flex items-center justify-center">
          <Image src="/icon/cloud.svg" alt="cloud" width={150} height={150} />
        </div>

        <h4 className="text-xl font-semibold mb-2">Oops! Hold on a second.</h4>

        <p className="text-[13px] font-inter">
          Deletion is not permitted for groups with active Benevolent Funds.
          Please contact Twezi Support to request formal closure in
          compliance with Data Protection and Financial Regulations.
        </p>

        <div className="mt-6 w-full">
          <AuthButton
            text="Close"
            handleClick={() => toggleModal("bfGroupDeletingModal")}
            className="w-full rounded-md bg-[#1170B2]"
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default BfGroupDeletingModal;
