import { useSettingModal } from "@/contexts/modal-setting";
import CustomDialog from "../custom/CustomDialog";

const ComingSoonModal = () => {
  const { closeModal } = useSettingModal();
  return (
    <CustomDialog
      close={() => {}}
      name="comingSoonModal"
      contentClassName="max-w-[450px]  z-[55] bg-white custom-modal"
    >
      <>
        <div className="  border-b  text-center pb-4 ">
          <span>🚧 Coming Soon!</span>
        </div>
        <div>
          <p className="  border-b  text-center pb-4">
            We&apos;re working on something exciting. This feature is currently under
            development and will be available soon. Stay tuned!
          </p>
        </div>
        <button
          onClick={() => {
            closeModal("comingSoonModal");
          }}
        >
          <span>Ok</span>
        </button>
      </>
    </CustomDialog>
  );
};

export default ComingSoonModal;
