import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

const SubmittedModal = () => {
  const { modals, toggleModal, modalData } = useSettingModal();

  const data = modalData?.submittedModal;
  const router = useRouter();

  const handleClose = () => {
    toggleModal("submittedModal");
    router.replace(data?.link || `/bf/${data?.groupId}/${data?.fundId}`);
  };
  return (
    <div
      className={`${
        modals.submittedModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-30`}
    >
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
          <h1 className="text-2xl font-bold mb-2">Great!</h1>
          <p className="text-center mb-4 text-[12px]">
            Your case has been submitted successfully. Keep an eye on your email
            for updates regarding your case.
            <br />
            <span className="relative top-3">
              Your case reference is: {data?.reference}
            </span>
          </p>
          <div className="w-full">
            <button
              onClick={() => handleClose()}
              className="w-full flex items-center justify-between bg-primary text-white px-9 py-6 mt-4"
            >
              <div className="flex items-center gap-2">
                <Image src="/icon/Text.svg" alt="Text" width={30} height={30} />
                <span className="relative left-2">Continue</span>
              </div>
              <Image src="/icon/Union.svg" alt="Union" width={12} height={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedModal;
