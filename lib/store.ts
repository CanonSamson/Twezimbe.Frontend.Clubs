import { configureStore } from '@reduxjs/toolkit'
import groupReducer from './features/groups/groupSlice'
import dmReducer from './features/dms/dmSlice'
import groupMessageReducer from './features/groups/groupMessageSlice'
import dmMessageReducer from './features/dms/dmMessageSlice'
import socketReducer from './features/socket/socketSlice'
import nextOfKinReducer from './features/kyc/nextOfKinSlice'
import contactReducer from './features/kyc/contactSlice'
import educationReducer from './features/kyc/educationSlice'
import employmentReducer from './features/kyc/employmentSlice'
import basicUserInfoSliceReducer from './features/kyc/basicUserInfoSlice'
import publicProfileInfoSliceReducer from './features/profile/publicProfileInfoSlice'
import socialsReducer from './features/profile/socialsSlice'
import documentSliceReducer from './features/kyc/documentSlice'
import bfSliceReducer from './features/bf/bfSlice'
import clubSliceReducer from './features/clubs/clubSlice'
import groupMessageInReplyReducer from './features/groups/groupMessageInReplySlice'
import dmMessageInReplyReducer from './features/dms/dmMessageInReplySlice'
import groupMessageInEditReducer from './features/groups/groupMessageInEditSlice'
import dmMessageInEditReducer from './features/dms/dmMessageInEditSlice'
import groupMemberReducer from './features/groups/groupMemberSlice'
import generalNotificationReducer from './features/notification/generalNotificationSlice'
import typingReducer from './features/chat/typingSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      group: groupReducer,
      dm: dmReducer,
      club: clubSliceReducer,
      groupMessage: groupMessageReducer,
      dmMessage: dmMessageReducer,
      socket: socketReducer,
      bf: bfSliceReducer,
      groupMessageInReply: groupMessageInReplyReducer,
      dmMessageInReply: dmMessageInReplyReducer,
      groupMessageInEdit: groupMessageInEditReducer,
      dmMessageInEdit: dmMessageInEditReducer,
      groupMembers: groupMemberReducer,
      generalNotifications: generalNotificationReducer,
      typing: typingReducer,
      //kyc
      nextOfKin: nextOfKinReducer,
      contact: contactReducer,
      education: educationReducer,
      employment: employmentReducer,
      basicUserInfo: basicUserInfoSliceReducer,
      document: documentSliceReducer,

      //profile
      publicProfileInfo: publicProfileInfoSliceReducer,
      socials: socialsReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
