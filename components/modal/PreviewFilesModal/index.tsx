import { MessageType } from "@/api/messaging/group";
import Hint from "@/components/Hint";
import UserProfileHint from "@/components/UserProfileHint";
import { useSettingModal } from "@/contexts/modal-setting";
import { getNameInitials } from "@/utils/functions/getNameInitials";
import moment from "moment";
import Image from "next/image";
import { useMemo } from "react";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

const PreviewFilesModal = () => {
  const { modals, modalData, toggleModal, updateModalData } = useSettingModal();

  const previewFilesModal = modals?.previewFilesModal;
  const index = modalData?.previewFilesModal?.index;

  const message = useMemo(() => {
    return modalData?.previewFilesModal?.message as MessageType;
  }, [modalData?.previewFilesModal]);
  const handleToggleModal = () => {
    toggleModal("previewFilesModal");
  };

  const user = {
    firstName: message?.user?.profile?.firstName,
    lastName: message?.user?.profile?.lastName,
    id: message?.user?.id,
    userName: message?.user?.profile?.userName,
    profileImage: message?.user?.profile?.profileImage,
  };
  return (
    <div
      className={` ${
        previewFilesModal ? "flex" : "hidden"
      } fixed left-0 w-full  right-0  p-10 top-0 bottom-0 items-center justify-center z-30`}
    >
      <button
        onClick={() => handleToggleModal()}
        disabled={false}
        className={`w-full  z-0 fixed items-center justify-center h-full bg-black bg-opacity-[75%] ${
          previewFilesModal ? "flex" : "hidden"
        }`}
      />
      <div className=" z-[20]  rounded-md relative bg-white w-full h-full flex items-center justify-center">
        <div className="z-[20] bg-gradient-to-b from-black/50 to-transparent absolute top-0 w-full">
          <div className=" flex items-center justify-between px-4 pt-2 w-full">
            <div className=" flex  text-black items-start gap-4">
              <div className={``}>
                {user?.firstName && (
                  <UserProfileHint align={"start"} user={user}>
                    {user?.profileImage ? (
                      <Image
                        src={user?.profileImage || "/avatar/2.svg"}
                        className={`w-[50px] min-w-[50px]  h-[50px] object-top rounded-xl
                              object-cover bg-white flex items-center justify-center `}
                        width={200}
                        height={200}
                        alt={user.firstName}
                      />
                    ) : (
                      <div
                        className="w-[50px] aspect-square rounded-xl 
                      bg-white flex items-center font-bold font-inter justify-center
                       text-primary text-[24px] uppercase "
                      >
                        {getNameInitials(
                          `${user?.firstName} ${user?.lastName}`
                        )}
                      </div>
                    )}
                  </UserProfileHint>
                )}
                {}
              </div>
              <div className=" flex flex-col gap-1 text-start">
                {user?.firstName && (
                  <UserProfileHint align={"start"} user={user}>
                    <h5
                      className={`text-[18px] font-semibold hover:underline duration-200 transition-all  cursor-pointer `}
                    >
                      {user?.firstName}
                    </h5>
                  </UserProfileHint>
                )}

                <Hint label={moment().format("MMM D, h:mm A")}>
                  <p className="text-[12px] uppercase cursor-pointer hover:underline duration-200 transition-all">
                    {message?.createdAt && moment(message?.createdAt).fromNow()}
                  </p>
                </Hint>
              </div>
            </div>
            <button onClick={() => handleToggleModal()}>
              <IoMdClose className=" text-black size-[24px]" />
            </button>
          </div>
        </div>
        {message?.files?.[index] && (
          <Image
            src={message?.files?.[index].url}
            alt="Uploaded file"
            className=" z-[10] h-full w-[80%] object-contain rounded-lg"
            width={500}
            height={500}
          />
        )}

        {(message?.files?.length ?? 0) > 1 && (
          <>
            {index > 0 && (
              <div className="z-[10] h-full px-4 flex items-center absolute top-0 left-0">
                <div>
                  <button
                    onClick={() => {
                      updateModalData("previewFilesModal", {
                        index: index - 1,
                      });
                    }}
                    className="flex items-center justify-center rounded-full h-[40px] w-[40px] bg-black text-white"
                  >
                    <IoIosArrowRoundBack className="size-[30px]" />
                  </button>
                </div>
              </div>
            )}
            {index < (message?.files?.length ?? 0) - 1 && (
              <div className="z-[10] h-full px-4 flex items-center absolute top-0 right-0">
                <div>
                  <button
                    onClick={() => {
                      updateModalData("previewFilesModal", {
                        index: index + 1,
                      });
                    }}
                    className="flex items-center justify-center rounded-full h-[40px] w-[40px] bg-black text-white"
                  >
                    <IoIosArrowRoundForward className="size-[30px]" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewFilesModal;
