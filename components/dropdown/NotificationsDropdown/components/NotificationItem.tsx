import TextRenderer from "@/components/TextRenderer";
import { cn } from "@/lib/utils";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Action {
  text: string | React.ReactNode;
  handleClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  loading: boolean;
}

interface NotificationItemProps {
  icon?: string;
  text?: string | React.ReactNode;
  createdAt: string;
  name?: string;
  unread?: boolean;
  actions?: Action[];
  type?:
    | "kyc-complete"
    | "group-invite"
    | "fund-created"
    | "mention"
    | "bf-created"
    | "bf-invite"
    | "channel-invite"
    | "channel-request"
    | string;
  metadata?: any;
  channelName?: string;
  group?: {
    id: string;
    name: string;
    iconImage: string;
  };
  bereavementFund?: {
    id: string;
    name: string;
    groupId: string;
  };
}

const NotificationItem = ({
  icon,
  text,
  createdAt,
  name,
  unread,
  actions = [],
  channelName,
  type,
  metadata,
  group,
  bereavementFund,
}: NotificationItemProps) => {
  const notificationIcon =
    type === "mention"
      ? metadata?.messageData?.user?.profile?.profileImage
      : icon
      ? icon
      : "/icon/notifblue.svg";

  const notificationName =
    type === "mention"
      ? `${metadata?.messageData?.user?.profile?.firstName} ${metadata?.messageData?.user?.profile?.lastName}`
      : name
      ? name
      : undefined;

  const channel = {
    name: "general",
  };
  const fund = {
    id: metadata?.fundId || bereavementFund?.id,
    groupId: metadata?.groupId || bereavementFund?.groupId,
    name: metadata?.groupName || group?.name || "Group",
    fundName: metadata?.fundName || bereavementFund?.name || "Benevolent Fund",
  };

  console.log("NotificationItem metadata", metadata);

  const BoldText = ({ children }: { children: React.ReactNode }) => (
    <strong className="text-gray-900 font-bold">{children}</strong>
  );

  const renderContent = () => {
    switch (type) {
      case "kyc-complete":
        return <BoldText>Congratulations 🎉. Your KYC is complete!</BoldText>;
      case "group-invite":
        return (
          <>
            <BoldText>{name}</BoldText> is inviting you to join their group{" "}
            <BoldText>{text}</BoldText>.{" "}
            <span className="text-primary">View group</span>
          </>
        );
      case "channel-invite":
        return (
          <>
            <BoldText>{name}</BoldText> is inviting you to join{" "}
            <BoldText>{channelName}</BoldText> channel in{" "}
            <BoldText>{group?.name}</BoldText>.
          </>
        );
      case "bf-invite":
        return (
          <>
            <BoldText>{name}</BoldText> is inviting you to join the bereavement
            fund <BoldText>{fund?.fundName}</BoldText> in{" "}
            <BoldText>{fund?.name}</BoldText>.
          </>
        );
      case "channel-request":
        return (
          <>
            <BoldText>{name}</BoldText> is requesting to join your{" "}
            <BoldText>{channelName}</BoldText> channel in{" "}
            <BoldText>{group?.name}</BoldText>.
          </>
        );
      case "bf-created":
        return (
          <>
            A new Benevolent Fund was created in{" "}
            <BoldText>{fund?.name}</BoldText>.{" "}
            <Link href={`/groups/${fund?.groupId}`}>
              <span className="text-primary">View</span>
            </Link>
          </>
        );
      case "mention":
        return (
          <TextRenderer value={metadata?.messageData?.text} mentioned={true} />
        );
      default:
        return text;
    }
  };

  const content = renderContent();

  return (
    <div className=" flex flex-col ">
      {type === "mention" && (
        <p className="relative  text-xs text-gray-500 font-semibold mb-1">
          @ Mention in: {group?.name} # {channel?.name}
        </p>
      )}

      <div className="flex relative  items-start gap-2 mobile:gap-3 text-xs mobile:text-sm text-gray-700 px-0 py-1 mobile:py-2 pr-0 hover:bg-gray-100 cursor-pointer">
        <Image
          src={notificationIcon}
          width={32}
          height={32}
          alt="Notification"
          className="rounded-lg object-center object-cover h-12 w-12"
        />
        <div className="flex-1">
          {notificationName && (
            <p className="text-black text-sm mobile:text-base">
              {notificationName}
            </p>
          )}
          <p className="text-[#666666] text-xs mobile:text-sm">{content}</p>
          <p className="text-[10px] mobile:text-xs mt-0.5 mobile:mt-1 text-primary">
            {moment(createdAt).fromNow()}
          </p>
          {actions.length > 0 && (
            <div className="mt-1 mobile:mt-2 flex gap-1 mobile:gap-2 flex-wrap">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.handleClick}
                  className={cn(
                    "rounded-lg gap-2 border border-gray-300 px-3 mobile:px-6 h-7 mobile:h-8 flex items-center justify-center text-center text-xs mobile:text-sm",
                    {
                      "bg-[#4D94C5] text-white": action.variant === "primary",
                      "bg-white text-[#4D94C5]": action.variant !== "primary",
                    },
                    action.className
                  )}
                >
                  {action.text}{" "}
                  {action.loading ? (
                    <AiOutlineLoading3Quarters className=" animate-spin duration-500 transition-all size-[16px]" />
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>
        {unread && (
          <span
            className={`w-2.5 h-2.5 rounded-full inline-block mb-5 ${
              unread ? "bg-orange-500" : ""
            }`}
          />
        )}
      </div>
      <div
        className="
  border-b mt-2 border-gray-300 
  w-screen left-1/2 -translate-x-1/2 
  tablet:w-full tablet:left-0 tablet:translate-x-0
  relative
"
      />
    </div>
  );
};

export default NotificationItem;
