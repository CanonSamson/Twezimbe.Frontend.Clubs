import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
// import { IoMdClose } from "react-icons/io";

const HomeModal = () => {
  const { modals, toggleModal } = useSettingModal();

  // const data = modalData?.homeModal;
  // const router = useRouter();

  const handleClose = () => {
    toggleModal("homeModal");
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (modals.homeModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modals.homeModal]);
  return (
    <div
      className={`${
        modals.homeModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30 items-center justify-center z-[100]`}
    >
      <div
        ref={modalRef}
        className="mt-96 bg-white w-full max-w-[420px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6 space-y-6"
      >
        <button className="flex items-start gap-4 text-left w-full">
          <div className="bg-primary rounded-md p-2">
            <Image
              src="/icon/ggroups.svg"
              alt="Group42"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-black font-inter">
              Groups
            </h1>
            <p className="text-sm text-gray-600 font-inter">Add a new group</p>
          </div>
        </button>

        <button className="flex items-start gap-4 text-left w-full">
          <div className="bg-primary rounded-md p-2">
            <Image
              src="/icon/savings.svg"
              alt="Group42"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-black font-inter">
              Savings
            </h1>
            <p className="text-sm text-gray-600 font-inter">
              Add new group savings
            </p>
          </div>
        </button>

        <button className="flex items-start gap-4 text-left w-full">
          <div className="bg-primary rounded-md p-2">
            <Image
              src="/icon/clubs.svg"
              alt="Group42"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-black font-inter">
              Club
            </h1>
            <p className="text-sm text-gray-600 font-inter">
              Create a new club
            </p>
          </div>
        </button>

        <button className="flex items-start gap-4 text-left w-full">
          <div className="bg-primary rounded-md p-2">
            <Image
              src="/icon/crowdfund.svg"
              alt="Group42"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-black font-inter">
              Crowd Fund
            </h1>
            <p className="text-sm text-gray-600 font-inter">
              Start a new crowd fund
            </p>
          </div>
        </button>
        <button
          onClick={() => toggleModal("homeModal")}
          className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition flex justify-center items-center gap-2"
        >
          <Image
            src="/icon/mmessage.svg"
            alt="Message Icon"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="font-inter">Message</span>
        </button>
      </div>
    </div>
  );
};

export default HomeModal;
