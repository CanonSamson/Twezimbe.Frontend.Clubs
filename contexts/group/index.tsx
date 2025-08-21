"use client";

import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";

// Types
import { GroupContextProps } from "@/types/groups";
import { UserContext } from "../user";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

// Project imports
import {
  fetchGroup,
  fetchGroupList,
  fetchUnreadChannelMessageCounts,
  fetchUnreadGroupMessageCounts,
  setGroup,
} from "@/lib/features/groups/groupSlice";
import { useInChatFileUpload } from "@/hooks/useInChatFileUpload";
import { fetchGroupMembers } from "@/lib/features/groups/groupMemberSlice";
import { hasPermission } from "@/utils/permissions/auth-abac";
import {
  selectHasGroupAccess,
  selectIsChannelAdmin,
} from "@/lib/selectors/groupSelectors";

// Initial state
const initialState: GroupContextProps = {
  hasAccess: true,
  isDragging: false,
  handleDrop: () => {},
  handleDragOver: () => {},
  handleDragLeave: () => {},
  collapsed: {},
  setCollapsed: () => {},
  handleToggleCollapse: () => {},
  setFileUrls: () => {},
  fileUrls: {},
  handleAddFiles: () => {},
  handleRemoveFile: () => {},
  handleClearFiles: () => {},
  isChannelAdmin: false,
  canDeleteGroup: false,
};

// ==============================|| NOTIFICATION CONTEXT & PROVIDER ||============================== //

const GroupContext = createContext<GroupContextProps>(initialState);

type GroupProviderProps = {
  children: ReactNode;
};

function GroupProvider({ children }: GroupProviderProps) {
  const isAuthenticated = useContextSelector(
    UserContext,
    (state: any) => state?.isAuthenticated
  );
  const { groupId, channelId } = useParams();
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
  const dispatch = useAppDispatch();
  const group = useAppSelector(
    (state) => state?.group?.groups[groupId as string]
  );

  const hasAccess = useAppSelector(selectHasGroupAccess(groupId as string));

  const isChannelAdmin = useAppSelector(
    selectIsChannelAdmin(groupId as string, channelId as string)
  );

  const {
    handleAddFiles,
    handleRemoveFile,
    fileUrls,
    setFileUrls,
    handleClearFiles,
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  } = useInChatFileUpload();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchGroupList());
      dispatch(fetchUnreadGroupMessageCounts());
      dispatch(fetchUnreadChannelMessageCounts());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (groupId == undefined) return;

    if (groupId) {
      dispatch(setGroup(group));
      dispatch(
        fetchGroup({
          groupId: groupId as string,
        })
      );
      dispatch(fetchGroupMembers({ groupId: groupId as string }));
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    if (groupId == undefined) return;
    dispatch(fetchGroupMembers({ groupId: groupId as string }));
  }, [groupId]);

  const handleToggleCollapse = (id: string) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [id]: !prevState?.[id],
    }));
  };

  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  );

  const canDeleteGroup = hasPermission(
    {
      blockedBy: [],
      roles: group?.roles || [],
      id: currentUser?.id as string,
    },
    "delete-group",
    "create",
    { groupId: group?.id as string }
  );

  return (
    <GroupContext.Provider
      value={{
        hasAccess,
        isDragging,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        canDeleteGroup,
        collapsed,
        setCollapsed,
        handleToggleCollapse,
        fileUrls,
        setFileUrls,
        handleAddFiles,
        handleRemoveFile,
        handleClearFiles,
        isChannelAdmin,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export { GroupProvider, GroupContext };
