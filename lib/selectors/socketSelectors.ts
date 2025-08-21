// lib/selectors/socketSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const getGroupOnlineUsers = (state: RootState) => state.socket.groupOnlineUsers;

export const selectOnlineUsersByGroup = createSelector(
  [getGroupOnlineUsers, (_: RootState, groupId: string) => groupId],
  (groupOnlineUsers, groupId) => groupOnlineUsers?.[groupId] || {}
);
