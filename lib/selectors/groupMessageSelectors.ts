import { MessageType } from "@/api/messaging/group";
import { createSelector } from "@reduxjs/toolkit";

export const selectChannelMessages = createSelector(
  [
    (state) => state.groupMessages, // your state slice
    (_state, groupId) => groupId,
    (_state, _groupId, channelId) => channelId,
  ],
  (groupMessages, groupId, channelId) => {
    const messages = groupMessages?.[groupId]?.[channelId] ?? [];
    return messages as MessageType[]; // return the same array if nothing has changed
  }
);
