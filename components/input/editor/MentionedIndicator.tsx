import { UserContext, UserContextType } from "@/contexts/user";
import { useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoAtSharp } from "react-icons/io5";
import { useContextSelector } from "use-context-selector";
import { selectChannelMessages } from "@/lib/selectors/groupMessageSelectors";

const MentionedIndicator = () => {
  const { channelId, groupId } = useParams();
  const [hidden, setHidden] = useState(false);

  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  );

  const userName = useMemo(
    () => `@${currentUser?.profile?.userName}`,
    [currentUser]
  );

  const messages = useAppSelector(
    (state) =>
      selectChannelMessages(state, groupId as string, channelId as string) || []
  );

  const filteredUnseen = useMemo(() => {
    return messages?.filter(
      (message) => message?.messageRead?.isRead === false
    );
  }, [messages]);

  const { mentioned, count } = useMemo(() => {
    if (filteredUnseen.length <= 0 || !userName) {
      return { mentioned: false, count: 0 };
    }

    const mentionedInMessages = filteredUnseen.filter((message) =>
      message?.text?.includes(userName)
    );

    return {
      mentioned: mentionedInMessages.length > 0,
      count: mentionedInMessages.length,
    };
  }, [filteredUnseen, userName]);

  const handleClick = () => {
    setHidden(true);
    const messageId = filteredUnseen[0]?.id;
    if (messageId) {
      const element = document.getElementById(messageId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  useEffect(() => {
    if (mentioned && hidden) {
      setHidden(false);
    }
  }, [mentioned, hidden]);

  return (
    <div className="flex items-end gap-2 h-[30px] tablet:h-[40px]">
      <button
        onClick={handleClick}
        className={`${
          !hidden && mentioned
            ? "h-[30px] w-[30px] tablet:h-[40px] tablet:w-[40px]"
            : "h-0 w-0"
        } bg-primary relative duration-400 transition-all text-white flex justify-center items-center opacity-55 hover:opacity-100 rounded-[10px]`}
      >
        <IoAtSharp className="size-[24px]" />
        {mentioned && (
          <div className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full absolute right-0 tablet:-right-2 -top-2 z-[20] bg-white text-black text-xs">
            {count > 99 ? "99+" : count}
          </div>
        )}
      </button>
    </div>
  );
};

export default MentionedIndicator;
