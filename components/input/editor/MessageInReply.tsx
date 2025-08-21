import { DmMessageType } from "@/api/dms/messaging";
import { GroupMemberType } from "@/api/group";
import { MessageType } from "@/api/messaging/group";
import dynamic from "next/dynamic";
import { IoCloseSharp } from "react-icons/io5";
import { VscReply } from "react-icons/vsc";

const TextRenderer = dynamic(() => import("../../TextRenderer"), {
  ssr: false,
});

const MessageInReply = ({
  messageInReply,
  handleRemove,
  members,
}: {
  handleRemove: () => void;
  messageInReply: DmMessageType | MessageType;
  members: GroupMemberType[] | undefined;
}) => {
  return (
    <div
      className={`bg-gray-50/90 hover:cursor-pointer duration-500 max-tablet:pt-3 max-tablet:px-3 transition-all overflow-hidden ${
        messageInReply ? "h-auto" : " h-[0px]"
      }`}
      onClick={() => {
        const messageElement = document.getElementById(`${messageInReply?.id}`);
        if (messageElement) {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }}
    >
      <div className="tablet:p-3 tablet:pt-5 flex items-start max-tablet:py-2 max-tablet:px-2 max-tablet:bg-[#E6E6E6] max-tablet:rounded-t-[10px]  justify-between">
        <div>
          <div className=" flex text-[#969696]  items-center gap-2">
            <VscReply className="  rotate-180 size-4" />
            <span className=" text-[14px]">
              Replying to {messageInReply?.user?.profile.firstName}{" "}
              {messageInReply?.user?.profile.lastName}
            </span>
          </div>

          <div className=" ml-6 mt-2">
            <TextRenderer
              value={messageInReply?.text}
              members={members}
              maxLength={200}
            />
            {messageInReply?.files?.length ? (
              <div>
                Message with {messageInReply.files.length} file
                {messageInReply.files.length > 1 ? "s" : ""}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className=" hover:bg-divider/50 duration-500 rounded-full h-[20px] w-[20px]"
          >
            <IoCloseSharp className=" size-[20px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInReply;
