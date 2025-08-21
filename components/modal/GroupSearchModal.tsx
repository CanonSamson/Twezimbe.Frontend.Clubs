import { searchGroupMessages } from "@/api/messaging/group";
import { useSettingModal } from "@/contexts/modal-setting";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useParams } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import TextRenderer from "../TextRenderer";
import CustomAvatar from "../custom/CustomAvatar";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/lib/hooks";

const GroupSearchModal = ({ className }: { className?: string }) => {
  const allGroupMembers = useAppSelector(
    (state) => state?.groupMembers.members
  );

  const { modals, modalData, closeModal } = useSettingModal();
  const [query, setQuery] = useState<undefined | string>(undefined);
  const search = modalData?.groupSearchModal?.search;

  const groupId = useParams().groupId as string;

  const { data, isLoading } = useQuery({
    queryKey: ["message-search", groupId, query],
    queryFn: () => searchGroupMessages(groupId, query ? { search: query } : {}),
    enabled: !!query,
  });

  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(search);
    }, 200);

    return () => clearTimeout(id);
  }, [search]);

  const messages = data?.data?.messages || [];

  const members = useMemo(() => {
    return allGroupMembers?.[groupId as string] || [];
  }, [allGroupMembers]);

  return (
    <div
      className={cn(
        "absolute top-20 z-50 w-full tablet-lg:right-4 bg-white flex-col text-black tablet-lg:w-full tablet-lg:max-w-[400px] rounded-lg p-4",
        modals?.groupSearchModal && search ? "flex" : "hidden", className
      )}
    
    >
      <div className="flex w-full py-2 text-[14px] gap-2 items-center">
        <BiSearch className="size-[24px]" />
        <p>{search || "Search"}</p>
      </div>

      <div className="flex flex-col  max-h-[400px] overflow-y-auto px-4">
        {isLoading && (
          <p className="text-sm text-gray-500 italic mt-4">
            Searching messages...
          </p>
        )}

        {!isLoading && messages.length === 0 && query && (
          <p className="text-sm text-gray-500 italic mt-4">
            No messages found.
          </p>
        )}

        {!isLoading &&
          messages.map((message, index) => {
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
                              members={members}
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
      </div>
    </div>
  );
};

export default GroupSearchModal;
