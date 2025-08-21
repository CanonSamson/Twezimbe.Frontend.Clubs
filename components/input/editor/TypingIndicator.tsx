import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { selectTypingUsersByKey } from "@/lib/selectors/typingSelectors";

const TypingIndicator = () => {
  const { channelId, groupId } = useParams();

  const typingUsers = useSelector((state: RootState) =>
    selectTypingUsersByKey(state, groupId as string, channelId as string)
  );

  const typingUserNames = useMemo(() => {
    return Object.values(typingUsers)
      .map((user) => user.firstName)
      .filter(Boolean);
  }, [typingUsers]);

  if (typingUserNames.length === 0) return null;

  const getTypingText = () => {
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} is typing...`;
    }
    if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    }
    return `${typingUserNames[0]}, ${typingUserNames[1]} and ${
      typingUserNames.length - 2
    } others are typing...`;
  };

  return (
    <div className="bg-gray-50/90 px-4 py-2">
      <p
        className={` text-[#969696] italic text-[14px] duration-500 transition-all overflow-hidden ${
          true ? "h-auto" : " h-[0px]"
        }`}
      >
        {getTypingText()}
      </p>
    </div>
  );
};

export default TypingIndicator;
