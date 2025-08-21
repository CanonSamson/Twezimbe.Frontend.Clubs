import { useSettingModal } from "@/contexts/modal-setting";
import { BsPinAngle } from "react-icons/bs";
import CustomAvatar from "../custom/CustomAvatar";
import { useQuery } from "@tanstack/react-query";
import { getPinedMessages } from "@/api/messaging/group/pinMessage";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import TextRenderer from "../TextRenderer";
import moment from "moment";

const PinnedMessageModal = () => {
  const { modals, toggleModal, closeModal } = useSettingModal();
  const { groupId } = useParams();

  const handleClose = () => {
    toggleModal("pinnedMessageModal");
  };

  const { data, refetch } = useQuery({
    queryKey: ["panned-group-messages", groupId as string],
    queryFn: () => getPinedMessages(groupId as string),
    enabled: !!groupId,
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (modals?.pinnedMessageModal) {
      refetch();
    }
  }, [modals?.pinnedMessageModal]);

  return (
    <div
      onClick={handleClose}
      className={`${
        modals?.pinnedMessageModal ? "flex" : "hidden"
      } fixed inset-0 bg-black/30  z-30 max-tablet-lg:px-4`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-20 tablet-lg:right-64 bg-white w-[95%] mx-[2.5%] right-0 tablet-lg:w-full tablet-lg:max-w-[400px] rounded-lg p-6 tablet-lg:mx-4"
      >
        <div className="flex flex-col items-center  w-full">
          {data?.data?.data &&
          data.data.data.length > 0 &&
          data.data.data.some(
            (pin) => pin.message && Object.keys(pin.message).length > 0
          ) ? (
            <>
              <div className="w-full">
                <div className="flex items-center space-x-2 pb-2 px-6 -mx-6 border-b border-gray-300">
                  <BsPinAngle size={25} />
                  <h1 className="text-[15px] font-inter">Pinned messages</h1>
                </div>
              </div>

              {data.data.data.map((pin, index) => {
                const message = pin.message;
                const userFullName = `${message?.user.profile.firstName} ${message?.user.profile.lastName}`;

                return (
                  message &&
                  Object.keys(message).length > 0 && (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();

                        const messageElement = document.getElementById(
                          `${message?.id}`
                        );
                        if (messageElement) {
                          messageElement.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                        closeModal("pinnedMessageModal");
                      }}
                      className="w-full mt-4"
                    >
                      <div className="bg-[#F5F5F5] -mx-4 px-6 py-2 rounded-md">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h1 className="text-left font-bold text-[15px]">
                              {userFullName}
                              <span className="text-[#616061]/75 text-sm ml-2">
                                {moment(message.createdAt).format("h:mm A")}
                              </span>
                            </h1>
                            <div className="text-left text-[#1D1C1D] mt-1 font-roboto text-[12px]">
                              {message.text ? (
                                <TextRenderer
                                  value={message.text}
                                  maxLength={200}
                                />
                              ) : message.files && message.files.length > 0 ? (
                                <div className="mt-2 text-gray-600 italic">
                                  This message contains file(s).
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <CustomAvatar
                            image={message.user.profile.profileImage}
                            className="justify-end"
                            imageClassName="h-10 w-10 object-cover text-base font-bold text-primary border rounded-[10px]"
                            labelClassName="h-10 w-10 rounded-[10px] overflow-hidden flex items-center justify-center mt-2"
                            alt="Profile picture"
                            showText={false}
                            disabled={true}
                            iconClassName="size-1"
                            userFullName={userFullName}
                          />
                        </div>
                      </div>
                    </button>
                  )
                );
              })}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-8 text-center text-gray-500">
              <BsPinAngle size={40} className="mb-2 text-gray-400" />
              <p className="text-sm font-inter">No pinned messages yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinnedMessageModal;
