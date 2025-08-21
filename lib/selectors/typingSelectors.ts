// lib/selectors/typingSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const getTypingState = (state: RootState) => state.typing.user;

export const selectTypingUsersByKey = createSelector(
    [getTypingState, (_: RootState, groupId: string, channelId: string) => `${groupId}${channelId}`],
    (typingUsers, key) => typingUsers[key] || {}
);
