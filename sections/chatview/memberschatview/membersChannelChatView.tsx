"use client";
import { useSettingModal } from "@/contexts/modal-setting";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { getGroupChannelMembers } from "@/api/channel";
import { useState } from "react";
import MemberCard from "@/components/modal/GroupDetailsModal/MemberCard";
import { ChannelType, GroupType } from "@/types/groups";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { RiAdminLine } from "react-icons/ri";

interface MembersProps {
  channel: ChannelType | undefined;
  group: GroupType | undefined;
}

const MembersChannelChatView = ({ channel }: MembersProps) => {
  const { toggleModal } = useSettingModal();

  const channelId = useParams()?.channelId as string;
  const groupId = useParams()?.groupId as string;

  const [filters, setFilters] = useState<{
    role: string;
    search?: string;
  }>({
    role: "everyone",
    search: undefined,
  });
  const { data, refetch } = useQuery({
    queryKey: [
      "channe-members",
      groupId,
      channelId as string,
      filters?.role,
      filters?.search,
    ],
    queryFn: () =>
      getGroupChannelMembers(groupId, channelId as string, filters),
  });

  const onlineUsers = useSelector(
    (state: RootState) => state?.socket?.groupOnlineUsers?.[groupId] || {}
  );

  const requireAcess = channel?.privacy === "PRIVATE";
  const access = channel?.access;

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const trimmedValue = e.target.value.trim();
      setFilters((prev) => {
        let updatedFilers = { ...prev };
        if (trimmedValue !== "") {
          updatedFilers = { ...updatedFilers, search: trimmedValue };
        } else {
          delete updatedFilers?.search;
        }
        return updatedFilers;
      });
      refetch();
    }, 500);
  };
  const [activeMemberActions, setActiveMemberAction] = useState< string| null>(null)

  return (
    <>
      <div className=" max-h-[400px] h-full flex flex-col flex-1 p-6 pt-0 min-h-[200px]">
        {requireAcess && access && (
          <div className="mt-6">
            <button
              onClick={() =>
                toggleModal("addChannelMembersModal", { channelId: channel.id })
              }
              className="flex items-center gap-4"
            >
              <RiAdminLine size={20} />
              <span className="text-[15px]">Invite your friends</span>
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4 pb-40">
          {data?.data.members?.map((member: any, index: number) => {
            return (
              <MemberCard
                key={index}
                firstName={member.user?.profile?.firstName}
                lastName={member.user?.profile?.lastName}
                profileImage={member.user?.profile?.profileImage}
                roles={member.permissions.map((item: string) => {
                  return {
                    permission:
                      item === "VIEW" || item === "CHAT" ? "USER" : item,
                  };
                })}
                isOnline={onlineUsers[member.user?.id]}
                id={member.user?.id as string}
                activeMemberActions={activeMemberActions} setActiveMemberAction={setActiveMemberAction}

              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MembersChannelChatView;
