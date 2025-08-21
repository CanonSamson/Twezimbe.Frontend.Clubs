import Image from "next/image";
import { AiOutlineLoading } from "react-icons/ai";
import { IoCheckmark, IoClose } from "react-icons/io5";

const CustomSlideToggle = ({
  isOn,
  toggle,
  disabled = false,
  isLoading = false,
}: {
  isOn: boolean;
  toggle: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <button
      onClick={toggle}
      disabled={disabled}
      className="w-10 h-5 relative cursor-pointer"
    >
      <div
        className={`w-full h-full rounded-full transition-colors duration-300 ${
          isOn ? "bg-green-500" : "bg-gray-500"
        }`}
      />

      <div
        className={`absolute top-0 left-0 h-5 w-5 flex items-center justify-center rounded-full transition-transform duration-300 transform ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      >
        <Image
          src="/icon/Ellipse.svg"
          alt="toggle"
          width={20}
          height={20}
          className="absolute inset-0"
        />
      </div>

      {isLoading ? (
        <div className="absolute inset-y-0 left-0 flex items-center pl-1">
          <AiOutlineLoading size={14} className="text-white" />
        </div>
      ) : isOn ? (
        <div className="absolute inset-y-0 left-0 flex items-center pl-1">
          <IoCheckmark size={14} className="text-white" />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 flex items-center pr-1">
          <IoClose size={14} className="text-white" />
        </div>
      )}
    </button>
  );
};

export default CustomSlideToggle;
