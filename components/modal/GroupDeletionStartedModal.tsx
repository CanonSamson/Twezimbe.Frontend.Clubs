import CustomDialog from "@/components/custom/CustomDialog";
import AuthButton from "@/components/button/AuthButton";
import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";

const GroupDeletionStartedModal = () => {
  const { toggleModal } = useSettingModal();
  return (
    <CustomDialog
      close={() => {}}
      name="groupDeletionStartedModal"
      contentClassName="max-w-[450px] py-10 z-[55] bg-white custom-modal"
    >
      <div className="flex flex-col items-center text-center p-0">
        <div className="mb-4 w-[100px] h-[100px] bg-[#C3DBEC] rounded-full flex items-center justify-center">
          <Image
            src="/icon/Group 42.svg"
            alt="cloud"
            width={150}
            height={150}
          />
        </div>

        <h4 className="text-xl font-semibold mb-2">Group Deletion Started</h4>

        <p className="text-[13px] font-inter">
          Members of this group will be notified and given 7 days’ notice before
          the deletion is finalized.
        </p>

        <div className="mt-6 w-full">
          <AuthButton
            text="Close"
            handleClick={() => toggleModal("groupDeletionStartedModal")}
            className="w-full rounded-md bg-[#1170B2]"
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default GroupDeletionStartedModal;
