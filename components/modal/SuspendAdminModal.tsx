import { useSettingModal } from "@/contexts/modal-setting";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

const SuspendAdminModal = () => {
  const { modals, toggleModal } = useSettingModal();

  //   const data = modalData?.suspendAdminModal;
  //   const router = useRouter();

  const handleClose = () => {
    toggleModal("suspendAdminModal");
  };
  return (
    <div
      className={`${
        modals.suspendAdminModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-30`}
    >
      <div className="bg-white w-full max-w-[500px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6 relative flex flex-col min-h-[200px]">
        <button
          onClick={() => handleClose()}
          className="absolute top-4 right-4 text-divider-200"
        >
          <IoMdClose size={24} />
        </button>

        <div className="flex-1 flex flex-col items-start justify-start mt-8">
          <h1 className="text-2xl font-bold mb-2 text-left">Confirm action</h1>
          <p className="mb-4 text-[12px] text-left">
            You are about to suspend{" "}
            <span className="text-primary font-semibold">Samson Salvation</span>{" "}
            admin privileges. They will lose access to group settings, member
            management, and moderation tools. Are you sure you want to proceed?
          </p>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => handleClose()}
            className="border border-gray-400 bg-white text-primary px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendAdminModal;
