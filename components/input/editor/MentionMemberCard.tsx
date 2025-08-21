import { GroupMemberType } from "@/api/group";
import CustomAvatar from "@/components/custom/CustomAvatar";
import { useAppSelector } from "@/lib/hooks";
import { selectOnlineUsersByGroup } from "@/lib/selectors/socketSelectors";
import { RootState } from "@/lib/store";

import { useParams } from "next/navigation";

const MentionMemberCard = ({
  isMentioning = false,
  handleOnSelectMention,
  members,
}: {
  isMentioning: boolean;
  handleOnSelectMention: (userName: string) => void;
  members: GroupMemberType[] | undefined;
}) => {
  const  groupId  = useParams().groupId as string;

 
  const onlineUsersByGroup = useAppSelector((state: RootState) =>
    selectOnlineUsersByGroup(state, groupId)
  );

  return (
    <div
      className={`tablet:left-10 bottom-[100%]  max-tablet:w-full right-0  tablet:min-w-[350px] tablet:max-w-[350px]   tablet:absolute ${
        members && isMentioning ? "" : "hidden"
      }`}
    >
      <div className="tablet:overflow-y-auto  tablet:max-h-[200px] px-4 pt-4 tablet:p-4 shadow tablet:mb-2 rounded-t-[10px] tablet:rounded-[10px] bg-white  ">
        <div className="max-tablet:overflow-y-auto  max-tablet:max-h-[200px] max-tablet:bg-gray-100 p-2 rounded-[10px]">
          {members &&
            members?.map((member, index) => {
              const fullname = `${member?.user.profile?.firstName} ${member?.user.profile?.lastName}`;
              const username = `@${member?.user.profile?.userName}`;
              return (
                <button
                  key={index}
                  className="flex  gap-2 items-center py-2 text-[14px]"
                  onClick={() =>
                    handleOnSelectMention(`${member?.user.profile?.userName}`)
                  }
                >
                  <CustomAvatar
                    image={member?.user.profile?.profileImage}
                    className="justify-start w-[30px] h-[30px] shrink-0 rounded-[5px]"
                    imageClassName="h-[30px] object-top text-[16px] font-bold text-primary border w-[30px] rounded-[5px] overflow-hidden flex items-center justify-center"
                    labelClassName="h-[30px] border-none w-[30px] rounded-[5px] overflow-hidden flex items-center justify-center"
                    alt="profile image"
                    showText={false}
                    iconClassName="w-[20px] h-[20px]"
                    userFullName={fullname}
                  />
                  <div className="  font-semibold">{fullname}</div>

                  <div
                    className={`h-[10px] flex relative w-[10px]  rounded-full ${
                      onlineUsersByGroup[member.user?.id]
                        ? " bg-green-600"
                        : "bg-gray-400"
                    }`}
                  />
                  <div>{username}</div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MentionMemberCard;
