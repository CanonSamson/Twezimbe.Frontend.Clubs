"use client";
import { useSettingModal } from "@/contexts/modal-setting";
import CustomSelect from "@/components/input/CustomSelect";
import MemberCard from "../../MemberCard";
import { hasPermission } from "@/utils/permissions/auth-abac";
import { RiAdminLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { UserContext, UserContextType } from "@/contexts/user";
import { useContextSelector } from "use-context-selector";
import { useQuery } from "@tanstack/react-query";
import { getGroupMembers } from "@/api/group";
import { GroupType } from "@/types/groups";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { selectOnlineUsersByGroup } from "@/lib/selectors/socketSelectors";

interface MembersProps {
  group: GroupType | undefined;
}

export const GroupMembers = ({ group }: MembersProps) => {
  const { toggleModal,  modals } = useSettingModal();
  const [filters, setFilters] = useState<{
    role: string;
    search?: string;
  }>({
    role: "everyone",
    search: undefined,
  });

  const groupId = useParams().groupId as string;

  const { data, refetch } = useQuery({
    queryKey: ["members", groupId, filters?.role, filters?.search],
    queryFn: () => {
      if (!groupId || groupId === "undefined") {
        return null;
      }
      return getGroupMembers(groupId, filters);
    },
    refetchOnWindowFocus: false,
    ...(!!modals?.groupDetailsModal && {
      refetchInterval: 5000, // Refetch every 5 seconds (adjust as needed)
    }),
  });

  const onlineUsersByGroup = useSelector((state: RootState) =>
    selectOnlineUsersByGroup(state, groupId)
  );

  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  );
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="flex items-center px-4 gap-4 w-full">
        <div className="flex items-center flex-1  gap-2 bg-divider-100 text-black justify-between px-4 rounded-[5px]">
          <FiSearch size={20} />
          <input
            type="text"
            placeholder="Find members"
            className="flex-1 bg-transparent py-1 text-[14px] focus:outline-none h-[45px] placeholder:text-black"
            onChange={onSearchChange}
          />
        </div>
        <div className="w-[40%]">
          <CustomSelect
            selectTriggerClassName="bg-divider-100 min-h-[45px]"
            options={[
              { label: "Everyone", value: "everyone" },
              { label: "Admin", value: "ADMIN" },
            ]}
            placeholder="Select group privacy"
            value={filters.role}
            onChange={(value) => {
              setFilters((prev) => {
                return { ...prev, role: value };
              });
            }}
            className="flex-1 mt-0"
          />
        </div>
      </div>
      <div className=" max-h-[400px] h-full overflow-y-auto flex flex-col flex-1 p-6 pt-0 min-h-[200px]">
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
          <div className="mt-6">
            <button
              onClick={() => toggleModal("inviteFriendsModal")}
              className="flex items-center gap-4"
            >
              <RiAdminLine size={20} />
              <span className="text-[15px]">Invite your friends</span>
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2  mt-4 pb-40">
          {data?.data.members?.map((member: any, index: number) => {
            return (
              <MemberCard
                key={index}
                firstName={member.user?.profile?.firstName}
                lastName={member.user?.profile?.lastName}
                profileImage={member.user?.profile?.profileImage}
                roles={member.roles}
                isOnline={onlineUsersByGroup[member.user?.id]}
                id={member.user?.id as string}
                refetch={refetch}
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
