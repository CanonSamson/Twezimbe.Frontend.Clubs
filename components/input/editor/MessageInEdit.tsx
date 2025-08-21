import { GroupMemberType } from "@/api/group";
import dynamic from "next/dynamic";
import { GoPencil } from "react-icons/go";
const TextRenderer = dynamic(() => import("../../TextRenderer"), {
  ssr: false,
});

const MessageInEdit = ({
  messageInEdit,
  members,
}: {
  messageInEdit: {
    id: string;
    text: string;
  };
  members: GroupMemberType[] | undefined;
}) => {
  return (
    <div
      className={`bg-gray-50/90   hover:cursor-pointer duration-500 transition-all overflow-hidden ${
        messageInEdit ? "h-auto" : " h-[0px]"
      }`}
      onClick={() => {
        const messageElement = document.getElementById(`${messageInEdit?.id}`);
        if (messageElement) {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }}
    >
      <div className="p-3 pt-5 flex items-start justify-between">
        <div>
          <div className=" flex text-[#969696]  items-center gap-2">
            <GoPencil className="  size-4" />
            <span className=" text-[14px]">Edit message</span>
          </div>

          <div className=" ml-6 mt-2">
            <TextRenderer
              value={messageInEdit?.text}
              members={members}
              maxLength={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInEdit;
