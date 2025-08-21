"use client";

import { useSettingModal } from "@/contexts/modal-setting";
import { hasPermission } from "@/utils/permissions/auth-abac";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { UserContext, UserContextType } from "@/contexts/user";
import { useContextSelector } from "use-context-selector";
import { useQuery } from "@tanstack/react-query";
import { getGroupMembers } from "@/api/group";
import { useState } from "react";
import MemberCard from "@/components/modal/GroupDetailsModal/MemberCard";
import { GroupType } from "@/types/groups";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { RiAdminLine } from "react-icons/ri";
import { FaChevronRight } from "react-icons/fa";
import { PiUserPlusFill } from "react-icons/pi";

interface MembersProps {
  group: GroupType | undefined;
}

const MembersGroupChatView = ({ group }: MembersProps) => {
  const { toggleModal } = useSettingModal();
  const [filters, setFilters] = useState<{
    role: string;
    search?: string;
  }>({
    role: "everyone",
    search: undefined,
  });
  const groupId = useParams().groupId as string;
  const { data, refetch } = useQuery({
    queryKey: ["members", groupId as string, filters?.role, filters?.search],
    queryFn: () => getGroupMembers(groupId, filters),
    refetchOnWindowFocus: false,
  });

  const onlineUsers = useSelector(
    (state: RootState) => state?.socket?.groupOnlineUsers?.[groupId] || {}
  );
  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  );
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
  const [activeMemberActions, setActiveMemberAction] = useState<string | null>(
    null
  );

  return (
    <>
      {hasPermission(
        {
          blockedBy: [],
          roles: group?.roles || [],
          id: currentUser?.id as string,
        },
        "group-invitations",
        "create",
        { groupId: groupId }
      ) && (
        <button
          onClick={() => toggleModal("inviteFriendsModal")}
          className="flex justify-between items-center bg-white rounded-md p-6 w-full shadow-sm h-14"
        >
          <div className="flex items-center">
            <div className="bg-primary rounded-full p-1 flex items-center justify-center">
              <PiUserPlusFill className="text-white h-6 w-6" />
            </div>
            <h4 className="font-inter text-[14px] ml-2">Invite your friends</h4>
          </div>
          <FaChevronRight className="text-black" />
        </button>
      )}

      <div className=" max-h-[400px] h-full  flex flex-col flex-1 p-6 pt-0 min-h-[200px]">
        <div className="flex flex-col gap-2 mt-4 pb-40">
          {data?.data.members?.map((member: any, index: number) => {
            return (
              <MemberCard
                key={index}
                firstName={member.user?.profile?.firstName}
                lastName={member.user?.profile?.lastName}
                profileImage={member.user?.profile?.profileImage}
                roles={member.roles}
                isOnline={onlineUsers[member.user?.id]}
                id={member.user?.id as string}
                activeMemberActions={activeMemberActions}
                setActiveMemberAction={setActiveMemberAction}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MembersGroupChatView;
