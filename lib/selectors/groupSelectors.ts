import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../store'

export const selectHasGroupAccess = (groupId: string) =>
  createSelector(
    (state: RootState) => state.group,
    group => {
      if (group?.loading?.fetchGroupList) return true
      return group?.groupList?.some(g => g.id === groupId)
    }
  )

export const selectIsChannelAdmin = (groupId: string, channelId: string) =>
  createSelector(
    (state: RootState) => state.group.groups?.[groupId],
    group => {
      const channel = group?.channels?.find(c => c.id === channelId)
      return (
        channel?.privacy === 'PUBLIC' ||
        channel?.role?.some(role => role.permissions.includes('ADMIN')) ||
        false
      )
    }
  )
