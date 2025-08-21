import { useSettingModal } from "@/contexts/modal-setting";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { FaLock } from "react-icons/fa6";
import { FaHashtag } from "react-icons/fa";

interface ChannelProps {
  channel: {
    id: string;
    name: string;
    privacy: "PUBLIC" | "PRIVATE";
    access: boolean;
  };
  activeChannelId: string;
  unread: boolean;
}

const Channel = ({ channel, unread }: ChannelProps) => {
  const { groupId, channelId } = useParams();
  const { toggleModal } = useSettingModal();
  const router = useRouter();

  const activeChannel = channelId === channel.id;

  const requireAcess = channel.privacy === "PRIVATE";
  const access = channel.access;

  return (
    <div
      className={cn(
        " pl-5  duration-300 transition-all hover:bg-white rounded-[5px] flex items-center",
        activeChannel && "bg-white font-medium",
        unread && "text-primary font-bold",
        !(activeChannel || unread) && "font-bold"
      )}
    >
      <button
        onClick={() => {
          router.push(`/groups/${groupId}/${channel.id}`);
        }}
        className=" flex flex-1 items-center gap-2"
      >
        {access && !requireAcess ? (
          <FaHashtag className=" text-divider-300 text-[14px]" />
        ) : (
          <FaLock className=" text-divider-300 text-[12px]" />
        )}

        <p
          className={`text-start line-clamp-2 text-[14px]  ${
            !(activeChannel || unread) ? "font-medium" : "font-bold"
          }`}
        >
          {channel.name}
        </p>
      </button>
      {requireAcess && access ? (
        <>
          <button
            onClick={() =>
              toggleModal("addChannelMembersModal", { channelId: channel.id })
            }
            className="px-2 hover:opacity-80  duration-300 transition-all"
          >
            <HiOutlineUserPlus className=" text-primary text-[16px]" />
          </button>
        </>
      ) : null}
    </div>
  );
};

export default Channel;
