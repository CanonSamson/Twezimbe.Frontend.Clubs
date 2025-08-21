// import Image from 'next/image'
import { MessageType } from "@/api/messaging/group";
import ImageCard from "./ImageCard";
import Image from "next/image";
import { LuDownload } from "react-icons/lu";
import { saveAs } from "file-saver";
import { getFileType } from "@/utils/functions/getFileType";
import { DmMessageType } from "@/api/dms/messaging";

const fileIcons = {
  pdf: "/icon/pdfIcon.svg",
  wd: "/icon/wdIcon.svg",
  zip: "/icon/packedFileIcon.svg",
  unknown: "/icon/unknownFileIcon.svg",
  xlsx: "/icon/spreadsheetFileIcon.svg",
  pptx: "/icon/presentationFIleIcon.svg",
};

const FileCards = ({
  files,
  message,
}: {
  files: {
    name: string;
    size: number;
    url: string;
    type: string;
  }[];
  message: MessageType | DmMessageType;
}) => {
  const allFilesAreImages = files.every((file) => {
    const extension = file.url.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(
      extension || ""
    );
  });

  const getFileIcon = (file: {
    name: string;
    size: number;
    url: string;
    type: string;
  }) => {
    if (!file) return fileIcons.unknown;

    const fileType = file.type;

    if (fileType.includes("pdf")) return fileIcons.pdf;
    if (
      fileType.includes("word") ||
      fileType.includes("wordprocessingml.document")
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

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
    const extension = fileType.split("/")[1]; // get the part after "image/"
    if (imageExtensions.includes(extension)) return file.url;

    return fileIcons.unknown;
  };

  console.log(files);
  const handleDownload = async (file: {
    name: string;
    size: number;
    url: string;
    type: string;
  }) => {
    if (file.url) {
      saveAs(file.url, file.name);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {!allFilesAreImages ? (
        <>
          {files.map((file, index) => {
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(file);
                }}
                className="group  relative p-[10px] bg-white gap-2 border-black/10 pr-10 rounded-[4px] text-[14px] flex items-center border"
              >
                <Image
                  src={getFileIcon(file)}
                  alt="File Icon"
                  className="h-[40px] w-[40px]   rounded-[5px]"
                  width={40}
                  height={40}
                />
                <div className="flex flex-col items-start w-full justify-center">
                  <p className=" line-clamp-1 max-w-[160px] text-start">
                    {/* <p className="truncate w-[120px]"> */}
                    {file?.name || "Unknown File"}
                  </p>
                  <p className="text-[12px] font-semibold capitalize">
                    {getFileType(file.name)}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file);
                  }}
                  className="bg-white max-tablet-lg:flex hidden  text-[#616061] absolute -top-[10px] -right-[10px] h-[20px] w-[20px] rounded-full group-hover:flex items-center justify-center"
                >
                  <LuDownload className="size-3" />
                </button>
              </button>
            );
          })}
        </>
      ) : (
        <>
          {files.slice(0, 6).map((file, index) => {
            const lastImage = index === 5;
            const hasNextFiles = index < files.length - 1;
            const remainingFilesCount = files.length - index - 1; // Calculate remaining files coun
            return (
              <div key={index}>
                <ImageCard
                  url={file.url}
                  lastImage={lastImage}
                  hasNextFiles={hasNextFiles}
                  remainingFilesCount={remainingFilesCount}
                  files={files}
                  index={index}
                  message={message}
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default FileCards;
