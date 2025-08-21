import Hint from "@/components/Hint";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import React from "react";
import { getFileType } from "@/utils/functions/getFileType";

const fileIcons = {
  pdf: "/icon/pdfIcon.svg",
  wd: "/icon/wdIcon.svg",
  zip: "/icon/packedFileIcon.svg",
  unknown: "/icon/unknownFileIcon.svg",
  xlsx: "/icon/spreadsheetFileIcon.svg",
  pptx: "/icon/presentationFIleIcon.svg",
};

interface UploadedFileCardProps {
  file: File | null;
  removeFile: () => void;
  completed: boolean;
  url: string;
  uploading: boolean;
}

const UploadedFileCard: React.FC<UploadedFileCardProps> = ({
  file,
  removeFile,
  completed,
  uploading,
  url,
}) => {
  const isImage =
    file?.type === "image/jpeg" ||
    file?.type === "image/png" ||
    file?.type === "image/webp";

  const getFileIcon = () => {
    if (!file) return fileIcons.unknown;

    const fileType = file.type;

    if (fileType.includes("pdf")) return fileIcons.pdf;
    if (
      fileType.includes("word") ||
      fileType.includes("Wordprocessingml.Document")
    )
      return fileIcons.wd;

    if (fileType.includes("xlsx") || fileType.includes("spreadsheetml.sheet"))
      return fileIcons.xlsx;
    if (
      fileType.includes("pptx") ||
      fileType.includes("presentationml.presentation")
    )
      return fileIcons.pptx;
    if (fileType.includes("zip") || fileType.includes("compressed"))
      return fileIcons.zip;

    return fileIcons.unknown;
  };

  if (isImage) {
    return (
      <div className="p-[2px]">
        <div className="relative size-[62px] flex items-center justify-center group/image">
          <Hint label="Remove image" handleClick={removeFile}>
            <div
              className={`${
                uploading ? "flex" : "group-hover/image:flex hidden"
              } rounded-full bg-black/70 hover:bg-black absolute -top-2 -right-2 text-white p-[2px] z-[4] border-white items-center justify-center`}
            >
              <div
                className={`${
                  uploading ? "group-hover/image:hidden flex" : "hidden"
                } animate-spin duration-700`}
              >
                <AiOutlineLoading3Quarters className="size-3.5" />
              </div>
              <div
                className={`${
                  uploading
                    ? "group-hover/image:flex hidden"
                    : "group-hover/image:flex hidden"
                }`}
              >
                <XIcon className="size-3.5" />
              </div>
            </div>
          </Hint>
          <div className="z-[2] flex absolute top-0 right-0 w-full h-full" />

          <Image
            src={url}
            alt="Uploaded"
            className="rounded-xl  overflow-hidden object-cover border"
            fill
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative  p-[10px] bg-[#F8F8F8] gap-2 border-black/10 pr-10 rounded-[4px] text-[14px] flex items-center border">
      <Image
        src={getFileIcon()}
        alt="File Icon"
        className="h-[40px] w-[40px]"
        width={40}
        height={40}
      />
      <div className="flex flex-col items-start justify-center">
        <p className=" line-clamp-1 max-w-[120px]">
          {file?.name || "Unknown File"}
        </p>
        <p className="text-[12px] font-semibold capitalize">
          {file?.name && getFileType(file.name)}
        </p>
      </div>

      <button className="bg-white text-[#616061] absolute -top-[10px] -right-[10px] h-[20px] w-[20px] rounded-full flex items-center justify-center">
        {completed ? (
          <XIcon className="size-3" />
        ) : (
          <AiOutlineLoading3Quarters className="animate-spin size-3" />
        )}
      </button>
    </div>
  );
};

export default UploadedFileCard;
