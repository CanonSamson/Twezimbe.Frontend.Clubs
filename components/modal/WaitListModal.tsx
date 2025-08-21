import { useSettingModal } from "@/contexts/modal-setting";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

const MODAL_CONFIG: Record<
  string,
  {
    title: string;
    description: string;
    buttonText: string;
    buttonColor?: string;
    backgroundColor?: string;
    imageSrc: string;
    imagetrc?: string;
  }
> = {
  savingsWaitListModal: {
    title: "Savings Group is coming to Twezi",
    description:
      "Soon, you’ll be able to save, grow, and reach your goals together. Create a group with friends, family, or your community and watch your savings grow faster — all inside Twezi.",
    buttonText: "Join Waitlist",
    buttonColor: "bg-primary",
    backgroundColor: "bg-orange-400",
    imageSrc: "/icon/tc1.svg",
    imagetrc: "/icon/bc1.svg",
  },
  crowdsWaitListModal: {
    title: "Big dreams shouldn’t wait.",
    description:
      "Soon on Twezi, you’ll be able to start a Crowd Fund, rally support, and make things happen — whether it’s for personal needs, emergencies, or community projects.",
    buttonText: "Join Waitlist",
    buttonColor: "bg-primary",
    backgroundColor: "bg-blue-700",
    imageSrc: "/icon/tc2.svg",
    imagetrc: "/icon/bc2.svg",
  },
  clubsWaitListModal: {
    title: "Introducing Clubs on Twezi!",
    description:
      "Soon, you’ll be able to create and manage your clubs in one place — from chess to badminton to social groups.Collect monthly dues, share announcements, and keep track of your members — all in Twezi",
    buttonText: "Join Waitlist",
    buttonColor: "bg-primary",
    backgroundColor: "bg-green-500",
    imageSrc: "/icon/tc3.svg",
    imagetrc: "/icon/bc3.svg",
  },
};

const WaitListModal = () => {
  const { modals, toggleModal } = useSettingModal();
  const activeModal = Object.keys(modals).find((key) => modals[key]);

  if (!activeModal || !MODAL_CONFIG[activeModal]) return null;

  const config = MODAL_CONFIG[activeModal];

  return (
    <div
      onClick={() => toggleModal(activeModal)}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[450px] min-h-[400px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] p-6 flex flex-col items-center justify-center overflow-hidden ${config.backgroundColor}`}
      >
        <Image
          src={config.imageSrc}
          alt="Top left icon"
          width={64}
          height={64}
          className="absolute top-0 left-0"
        />

        <button
          onClick={() => toggleModal(activeModal)}
          className="absolute top-4 right-4 text-divider-200"
        >
          <IoMdClose size={24} className="text-white" />
        </button>

        <div className="flex flex-col items-center mt-8 mb-8">
          <div className="max-w-[350px] w-full text-center">
            <h1 className="text-4xl font-bold text-center text-white mb-4">
              {config.title}
            </h1>
            <p className="text-center mb-4 text-[14px] whitespace-pre-line text-white">
              {config.description}
            </p>
          </div>

          <div className="w-full">
            <button
              className={`w-full flex items-center justify-center text-primary bg-white px-3 py-3 rounded-full mt-4 font-bold ${config.buttonColor}`}
              onClick={() => toggleModal(activeModal)}
            >
              {config.buttonText}
            </button>
          </div>
        </div>

        {config.imagetrc && (
          <Image
            src={config.imagetrc}
            alt="Bottom right icon"
            width={100}
            height={100}
            className="absolute bottom-0 right-0"
          />
        )}
      </div>
    </div>
  );
};

export default WaitListModal;
