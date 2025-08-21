import { FaCamera } from "react-icons/fa6";
import Image from "next/image";
import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { getNameInitials } from "@/utils/functions/getNameInitials";

interface CustomAvatarProps {
  image?: string | null;
  disableFileUpload?: boolean;
  onFileChange?: (file: File) => void;
  isLoading?: boolean;
  className?: string;
  alt?: string;
  disabled?: boolean;
  labelClassName?: string;
  textClassName?: string;
  iconClassName?: string;
  showText?: boolean;
  text?: string;
  imageClassName?: string;
  isCurrentUser?: boolean;
  userFullName?: string;
}

const CustomAvatar = ({
  image,
  disableFileUpload,
  onFileChange,
  isLoading = false,
  className = "",
  alt = "Avatar",
  disabled = false,
  labelClassName,
  textClassName,
  iconClassName,
  showText = true,
  text = "Upload",
  imageClassName,
  userFullName,
  isCurrentUser = false,
}: CustomAvatarProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileChange) {
      onFileChange(file);
    }
  };

  return (
    <div
      className={cn(
        "flex hover:opacity-95 duration-300 group justify-center relative",
        className
      )}
    >
      <label
        className={cn(
          "border border-black border-spacing-6 border-dashed",
          "bg-transparent rounded-full text-divider-200 uppercase",
          "flex-col flex items-center justify-center cursor-pointer h-[70px] w-[70px]",
          labelClassName
        )}
      >
        {image && typeof image === "string" ? (
          <Image
            src={image}
            className={cn(
              "h-full  w-full  absolute rounded-full object-cover object-center",
              imageClassName,
              disabled ? "" : "group-hover:opacity-20"
            )}
            alt={alt}
            width={100}
            height={100}
          />
        ) : !isCurrentUser && userFullName ? (
          <div
            className={cn(
              "h-full  w-full text-center  justify-center bg-gray-100  absolute rounded-full object-cover object-center",
              imageClassName
            )}
          >
            {getNameInitials(userFullName)}
          </div>
        ) : null}
        <>
          <FaCamera
            className={cn(
              "size-[20px]",
              iconClassName,
              disableFileUpload && "hidden"
            )}
          />
          {showText && !disableFileUpload && (
            <span className={cn("text-[14px]", textClassName)}>{text}</span>
          )}
        </>

        {!disableFileUpload && (
          <input
            disabled={isLoading || disabled}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        )}
      </label>
    </div>
  );
};

export default CustomAvatar;
