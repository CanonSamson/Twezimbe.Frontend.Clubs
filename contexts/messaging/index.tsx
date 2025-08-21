'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'

// Project imports

// Types
import { MessagingContextProps } from '@/types/messaging'
import { useSocket } from '@/hooks/useSocket'
import { Event, useSocketEvents } from '@/hooks/useEventsSocket'
import { MessageType } from '@/api/messaging/group'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import {
  setGroupOnlineUsers,
  setOnlineUsers
} from '@/lib/features/socket/socketSlice'
import { UserContext } from '../user'
import { useAppDispatch } from '@/lib/hooks'
import {
  addGroupChannel,
  deleteGroupChannel,
  fetchGroupList,
  fetchUnreadChannelMessageCounts,
  fetchUnreadGroupMessageCounts,
  refetchGroup,
  updateGroup,
  updateGroupBfPermission,
  updateGroupChannel,
  updateGroupMemberSettings
} from '@/lib/features/groups/groupSlice'
import { ChannelType } from '@/types/channel'
import { toast } from 'sonner'
import { queryClient } from '../ProviderWrapper'
import { useContextSelector } from 'use-context-selector'
import {
  addMessageReaction,
  addNewMessages,
  addUnreadGroupMessageCounts,
  handleEditMessage,
  removeChannelMessage,
  removeMessageReaction,
  updateChannelMessage,
  updateUnreadChannelMessageCounts,
  updateUnreadGroupMessageCounts
} from '@/lib/features/groups/groupMessageSlice'
import {
  setUserIsNotTyping,
  setUserIsTyping
} from '@/lib/features/chat/typingSlice'
import {
  addRequests,
  incrementPendingRequestsCount
} from '@/lib/features/notification/generalNotificationSlice'
import { useSettingModal } from '../modal-setting'
import { groupBaseUrl } from '@/utils/navigation'
import { playNewMessageSoundEffect } from '@/utils/functions/sound'
import { FundInviteReceivedModalData } from '@/components/modal/FundInviteReceivedModal'
import { DmMessageType } from '@/api/dms/messaging'
import {
  addNewDmMessage,
  handleEditDmMessage
} from '@/lib/features/dms/dmMessageSlice'
import { fetchDmsList } from '@/lib/features/dms/dmSlice'

// Initial state
const initialState: MessagingContextProps = {
  groupRealTimeData: {},
  setGroupRealTimeData: () => {},
  socket: null,
  groupChannelMessagesData: {},
  setChannelMessagesData: () => {}
}

// ==============================|| MESSAGE CONTEXT & PROVIDER ||============================== //

const MessagingContext = createContext<MessagingContextProps>(initialState)

type MessageingProviderProps = {
  children: ReactNode
}

function MessageingProvider ({ children }: MessageingProviderProps) {
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  )

  const groupKeys = useSelector((state: RootState) => state.group.groupKeys)
  const dispatch = useAppDispatch()

  const { connect, isConnected, socket } = useSocket()

  const { closeModal, closeAllModals, toggleModal, openModal } =
    useSettingModal()
  const [groupRealTimeData, setGroupRealTimeData] = useState<{
    [key: string]: { id: string }
  }>({})

  const [groupChannelMessagesData, setGroupChannelMessagesData] = useState<{
    [key: string]: MessageType[] | undefined
  }>({})
  const [channelMessagesData, setChannelMessagesData] = useState<{
    [key: string]: MessageType[]
  }>({})

  const { channelId, groupId } = useParams()
  const router = useRouter()
  useEffect(() => {
    if (currentUser?.id) connect()
  }, [currentUser?.id])

  useEffect(() => {
    setGroupChannelMessagesData(prev => ({
      ...prev,
      [channelId as string]: []
    }))
  }, [channelMessagesData[channelId as string]])

  useEffect(() => {
    if (isConnected) {
      socket?.emit('user:online-events', currentUser?.id)
      if (Object.keys(groupKeys).length > 0) {
        const keys = Object.keys(groupKeys)
        socket?.emit('group:message-events:listen', keys)
      }
    }

    return () => {
      if (isConnected) {
        socket?.emit('user:offline-events', currentUser?.id)
        if (Object.keys(groupKeys).length > 0) {
          const keys = Object.keys(groupKeys)
          socket?.emit('group:message-events:unlisten', keys)
        }
      }
    }
  }, [groupKeys, isConnected])

  const channelReactions: Event[] = [
    {
      event: 'channel-message:reaction:added',
      callback: ({
        messageId,
        userId,
        emoji,
        groupId,
        channelId,
        reactionId,
        createdAt
      }) => {
        dispatch(
          addMessageReaction({
            messageId,
            userId,
            emoji,
            groupId,
            channelId,
            reactionId,
            createdAt
          })
        )
      }
    },
    {
      event: 'channel-message:reaction:removed',

      callback: ({
        messageId,
        userId,
        emoji,
        groupId,
        channelId,
        reactionId
      }) => {
        console.log(
          messageId,
          userId,
          emoji,
          groupId,
          channelId,
          reactionId,
          'removed'
        )
        dispatch(
          removeMessageReaction({
            messageId,
            userId,
            emoji,
            groupId,
            channelId,
            reactionId
          })
        )
      }
    }
  ]
  const channelMessages: Event[] = [
    {
      event: 'group-channel:message:deleted',
      callback: ({ groupId, channelId, messageId }) => {
        dispatch(
          removeChannelMessage({
            groupId: groupId as string,
            channelId: channelId as string,
            messageId: messageId as string
          })
        )
      }
    },
    {
      event: 'group-channel:message:edited',
      callback: ({ groupId, channelId, messageId, message }) => {
        dispatch(
          handleEditMessage({
            groupId: groupId as string,
            channelId: channelId as string,
            messageId: messageId as string,
            text: message?.text
          })
        )
      }
    },
    {
      event: 'group-channel:message:pinned',
      callback: ({ groupId, message }) => {
        updateChannelMessage({
          groupId,
          channelId: message.channelId,
          messageId: message.id,
          updatedFields: message
        })
        queryClient.invalidateQueries({
          queryKey: ['panned-group-messages', groupId as string]
        })
      }
    },
    {
      event: 'group-channel:message:unpinned',
      callback: ({ groupId, message }) => {
        dispatch(
          updateChannelMessage({
            groupId,
            channelId: message.channelId,
            messageId: message.id,
            updatedFields: message
          })
        )
        queryClient.invalidateQueries({
          queryKey: ['panned-group-messages', groupId as string]
        })
      }
    },
    {
      event: 'group-user:channel-unpinned-message-events:listen',
      callback: ({ groupId, message, messageId }) => {
        dispatch(
          updateChannelMessage({
            groupId,
            channelId: message.channelId,
            messageId: messageId,
            updatedFields: message
          })
        )
        queryClient.invalidateQueries({
          queryKey: ['panned-group-messages', groupId as string]
        })
      }
    }
  ]

  const channel: Event[] = [
    {
      event: 'group-channel:channel-updated-events:listen',
      callback: ({
        channel
      }: {
        channel: ChannelType & {
          groupId: string
          topic: string
          description: string
        }
      }) => {
        console.log(channel, 'channel')
        dispatch(
          updateGroupChannel({
            groupId: channel.groupId,
            channel: {
              id: channel.id,
              name: channel.name,
              topic: channel.topic,
              description: channel.description,
              privacy: channel?.privacy,
              type: channel?.type
            }
          })
        )
      }
    },
    {
      event: 'group-user:channel-deleted-events:listen',
      callback: ({
        channel,
        generalChannel,
        deletedBy
      }: {
        channel: ChannelType & {
          groupId: string
        }
        generalChannel: ChannelType & {
          groupId: string
        }
        deletedBy: string
      }) => {
        if (deletedBy === currentUser.id) {
          return
        }

        closeModal('groupDetailsModal')

        if (channel.id === channelId) {
          closeAllModals()

          router.replace(groupBaseUrl(channel.groupId, generalChannel?.id))

          dispatch(
            updateGroupChannel({
              groupId: channel.groupId,
              channel: {
                id: channel.id,
                deleted: true
              }
            })
          )
        } else {
          toast('Channel Deleted', {
            description: `#${channel.name} has been deleted by an admin.`,
            action: {
              label: 'View Group',
              onClick: () => {
                router.push(groupBaseUrl(channel.groupId, generalChannel?.id))
              }
            }
          })
          dispatch(
            deleteGroupChannel({
              groupId: channel.groupId,
              channel: {
                id: channel.id
              }
            })
          )
        }
      }
    }
  ]

  const request: Event[] = [
    {
      event: 'group-channel:channel-request-events:listen',
      callback: ({ request }) => {
        toast('New Channel Request', {
          description:
            "You've received a new request someone wants to join your channel",
          action: {
            label: 'View',
            onClick: () => {
              router.push('/notification/requests')
            }
          }
        })

        dispatch(addRequests(request))
        dispatch(incrementPendingRequestsCount(1))
      }
    }
  ]
  const invites: Event[] = [
    {
      event: 'group-channel:channel-invite-events:listen',
      callback: ({ invite, groupId, channelId }) => {
        queryClient.invalidateQueries({
          queryKey: ['channel-invite', groupId, channelId]
        })
        toast('Channel Invitation', {
          description: "You've received a new invitation to join a channel",
          action: {
            label: 'View',
            onClick: () => {
              router.push(`/groups/${groupId}/${channelId}`)
            }
          }
        })
      }
    },
    {
      event: 'bf-invite:bf-invite-events:listen',
      callback: (data: FundInviteReceivedModalData) => {
        console.log(data, 'fundInviteReceivedModal')
        openModal('fundInviteReceivedModal', { ...data })
      }
    }
  ]

  const bf: Event[] = [
    {
      event: 'bf:role:removed:listen',
      callback: ({ groupId }) => {
        console.log(groupId, 'bf:role:removed:listen')
        dispatch(refetchGroup({ groupId }))
      }
    },
    {
      event: 'bf:role:assign:listen',
      callback: ({ groupId }) => {
        // callback: ({ groupId, fundId }) => {
        console.log(groupId, 'bf:role:assign:listen')
        dispatch(refetchGroup({ groupId }))
      }
    },
    {
      event: 'bf-fund-wallet:transaction:listen',
      callback: data => {
        console.log(data, 'bf-fund-wallet:transaction:listen')
      }
    },
    {
      event: 'bfwallet:transaction:listen',
      callback: data => {
        console.log(data, 'bfwallet:transaction:listen')
      }
    },
    {
      event: 'bfwallet:updated:listen',
      callback: data => {
        console.log(data, 'bfwallet:updated:listen')

        queryClient.invalidateQueries({
          queryKey: [data.fundId, 'user-wallet', data?.userId]
        })

        queryClient.invalidateQueries({
          queryKey: ['transactions-user', data?.fundId]
        })
      }
    }
  ]

  const transactions: Event[] = [
    {
      event: 'bf-wallet:transaction-update-events:listen',
      callback: (data: any) => {
        console.log(data, 'bf-wallet:transaction-update-events:listen')

        queryClient.invalidateQueries({
          queryKey: ['transactions-user', data.transaction?.fundId]
        })
      }
    },
    {
      event: 'bf-wallet:transaction-created-events:listen',
      callback: (data: any) => {
        console.log(data, 'bf-wallet:transaction-created-events:listen')

        queryClient.invalidateQueries({
          queryKey: ['transactions-user', data.transaction?.fundId]
        })
      }
    },
    {
      event: 'bf-wallet:transaction-success-events:listen',
      callback: (data: any) => {
        console.log(data, 'bf-wallet:transaction-created-events:listen')

        queryClient.invalidateQueries({
          queryKey: ['transactions-user', data.transaction?.fundId]
        })

        toast.success('Transaction successful', {
          description: `Your transaction of ${data.transaction?.amount} ${data.transaction?.currency} was successful.`
        })
      }
    },
    {
      event: 'bf-fund-wallet:credit-events:listen',
      callback: (data: any) => {
        console.log(data, 'bf-fund-wallet:credit-events:listen')

        queryClient.invalidateQueries({
          queryKey: [data?.fundId, 'getDashboardStats']
        })
      }
    },
    {
      event: 'fund:transition-updated-events:listen',
      callback: (data: { userId: string; fundId: string }) => {
        console.log(data, 'fund:transition-updated-events:listen')

        queryClient.invalidateQueries({
          queryKey: ['getTransitionMember', data.fundId]
        })
      }
    }
  ]
  const groups: Event[] = [
    ...bf,
    ...channelReactions,
    ...channelMessages,
    ...channel,
    {
      event: 'group:deleted-events:listen',
      callback: ({ userId, groupId }) => {
        console.log(userId, groupId, 'group:deleted-events:listen')
        dispatch(fetchGroupList())
      }
    },
    {
      event: 'group:bf-created:listen',
      callback: ({ fund, groupId }) => {
        console.log(fund, groupId, 'group:bf-created:listen')
        dispatch(refetchGroup({ groupId }))
      }
    },
    {
      event: 'group:member-made-admin:listen',
      callback: ({ groupId }) => {
        console.log(groupId, 'group:member-made-admin:listen')
        dispatch(refetchGroup({ groupId }))
      }
    },
    {
      event: 'group:member-removed-admin-role:listen',
      callback: ({ groupId }) => {
        console.log(groupId, 'group:member-removed-admin-role:listen')
        dispatch(refetchGroup({ groupId }))
      }
    },
    {
      event: 'group:new-user-invited-events:listen',
      callback: ({ groupId }) => {
        console.log(groupId, 'group:new-user-invited-events:listen')

        queryClient.invalidateQueries({
          queryKey: ['getTaskStats', groupId]
        })
        queryClient.invalidateQueries({
          predicate: query => {
            const [resource, id] = query.queryKey
            return resource === 'members' && id === groupId
          }
        })
      }
    },
    {
      event: 'group:user-left-events:listen',
      callback: ({ groupId }) => {
        console.log(groupId, 'group:user-left-events:listen')
        dispatch(refetchGroup({ groupId }))
        queryClient.invalidateQueries({
          predicate: query => {
            const [resource, id] = query.queryKey
            return resource === 'members' && id === groupId
          }
        })
      }
    },
    {
      event: 'group:member-removed:listen',
      callback: ({ userId, groupId: removedGroupId }) => {
        if (groupId === removedGroupId) {
          router.replace('/home')
        }
        toast.info('You have been removed from a group...')
        console.log(userId, groupId, 'group:member-removed:listen')
        dispatch(fetchGroupList())
      }
    }
  ]

  const dms: Event[] = [
    {
      event: 'dm:conversation:new-message:created',
      callback: (data: {
        otherUserId: string
        text: string
        message: DmMessageType
      }) => {
        if (data?.message.senderId !== currentUser?.id) {
          dispatch(
            addNewDmMessage({
              otherUserId: data?.message.senderId,
              message: data.message
            })
          )
          playNewMessageSoundEffect()
        }
      }
    },
    {
      event: 'dm:conversation:created',
      callback: () => {
        dispatch(fetchDmsList())
      }
    },
    {
      event: 'dm:message:edited',
      callback: (data: {
        conversationId: string
        messageId: string
        senderId: string
        receiverId: string
        message: DmMessageType
      }) => {
        dispatch(fetchDmsList())
        dispatch(
          handleEditDmMessage({
            otherUserId:
              data.senderId === currentUser?.id
                ? data.receiverId
                : data.senderId,
            messageId: data.messageId,
            text: data.message.text
          })
        )
      }
    },
    {
      event: 'dm:message:deleted',
      callback: (data: {
        conversationId: string
        messageId: string
        senderId: string
        receiverId: string
        message: DmMessageType
      }) => {
        dispatch(fetchDmsList())
        dispatch(
          handleEditDmMessage({
            otherUserId:
              data.senderId === currentUser?.id
                ? data.receiverId
                : data.senderId,
            messageId: data.messageId,
            text: data.message.text
          })
        )
      }
    }
  ]

  const events: Event[] = [
    ...dms,
    ...transactions,
    ...request,
    ...invites,
    ...groups,
    {
      event: 'is-typing',
      callback: ({ id, user }) => {
        dispatch(
          setUserIsTyping({
            id,
            user
          })
        )
      }
    },
    {
      event: 'stopped-typing',
      callback: ({ id, user }) => {
        dispatch(
          setUserIsNotTyping({
            id,
            user
          })
        )
      }
    },
    {
      event: 'user:online-events:listen',
      callback: list => {
        dispatch(setOnlineUsers(list))
      }
    },
    {
      event: 'group-user:online-events:listen',
      callback: list => {
        dispatch(setGroupOnlineUsers(list))
      }
    },
    {
      event: 'group:channel:new-message:created',
      callback: (data: {
        channelId: string
        groupId: string
        text: string
        message: MessageType
      }) => {
        if (data?.message.user?.id !== currentUser?.id) {
          dispatch(addNewMessages(data))
          playNewMessageSoundEffect()
        }
      }
    },
    {
      event: 'group:updated-events:listen',
      callback: (data: { groupId: string }) => {
        const { groupId, ...rest } = data
        console.log(data, groupId, 'updated-events')
        dispatch(
          updateGroup({
            groupId: data?.groupId,
            group: rest
          })
        )
      }
    },
    {
      event: 'group:member-update-member-settings:listen',
      callback: (data: { groupId: string; settings: any }) => {
        const { groupId } = data
        console.log(data, 'updated-events')
        dispatch(
          updateGroupMemberSettings({
            groupId: groupId,
            settings: data?.settings
          })
        )
      }
    },
    {
      event: 'group:channel:new-channel:created',
      callback: (data: {
        channelId: string
        groupId: string
        channel: ChannelType
        private: boolean
        userId: string
      }) => {
        if (data.private && currentUser.id === data?.userId) {
          dispatch(addGroupChannel(data))
        } else if (data.private) {
          dispatch(
            addGroupChannel({
              groupId: data?.groupId,
              channel: { ...data.channel, access: false, role: [] },
              userId: data?.userId,
              access: false
            })
          )
        } else {
          dispatch(addGroupChannel(data))
        }
      }
    },
    {
      event: 'group-channel:request-accepted-events:listen',
      callback: (data: {
        channelId: string
        groupId: string
        permissions: 'VIEW' | 'CHAT'[]
      }) => {
        dispatch(
          updateGroupChannel({
            groupId: data.groupId,
            channel: {
              id: data?.channelId,
              access: true,
              role: [
                {
                  permissions: data?.permissions
                }
              ]
            }
          })
        )
      }
    },
    {
      event: 'group:message-events:listen',
      callback: (data: { groupId: string }) => {
        console.log(data, 'data')
        setGroupRealTimeData(prev => ({
          ...prev,
          [data.groupId]: { ...prev[data.groupId], ...data }
        }))
      }
    },
    {
      event: 'bf:request-approved-events:listen',
      callback: (data: {
        fundId: string
        permission: string
        groupId: string
        bfName: string
      }) => {
        dispatch(updateGroupBfPermission(data))

        toggleModal('bfRequestApprovedModal', {
          fundId: data.fundId,
          permission: data.permission,
          groupId: data.groupId,
          bfName: data.bfName
        })
      }
    },
    {
      event: 'bf:request:listen',
      callback: (data: { fundId: string; bfName: string }) => {
        queryClient.invalidateQueries({
          queryKey: ['bf-access-request', data.fundId]
        })
        toast.info(`New Benevolent Fund request received from ${data.bfName}`)
      }
    },
    {
      event: 'group-user:read-channel-messages-events:listen',
      callback: () => {
        //       callback: (data: {
        //   channelId: string;
        //   groupId: string;
        //   error: string | undefined;
        //   count?: undefined | number;
        //   newCount?: number;
        // }) => {

        dispatch(fetchUnreadGroupMessageCounts())
        dispatch(fetchUnreadChannelMessageCounts())
        // dispatch(
        //   updateUnreadChannelMessageCounts({
        //     channelId: data?.channelId,
        //     value: false,
        //   })
        // );
        // if (data?.groupId) {
        //   dispatch(
        //     updateUnreadGroupMessageCounts({
        //       count: data?.newCount || 0,
        //       groupId: data?.groupId,
        //     })
        //   );
        // }
      }
    },
    {
      event: 'group-user:unread-messages-count-events:listen',
      callback: () => {
        //    callback: (data: {
        //   groupId: string;
        //   error: string | undefined;
        //   count?: undefined | number;
        // }) => {
        // console.log(data, "group-user:unread-messages-count-events:listen");

        // if (data?.groupId) {
        //   dispatch(
        //     updateUnreadGroupMessageCounts({
        //       count: data?.count || 0,
        //       groupId: data?.groupId,
        //     })
        //   );
        // }

        dispatch(fetchUnreadGroupMessageCounts())
        dispatch(fetchUnreadChannelMessageCounts())
      }
    },
    {
      event: 'group-user:unread-channel-events:listen',
      callback: (data: {
        channelId: string
        error: string | undefined
        count?: undefined | number
        addCount?: undefined | number
        groupId: string | undefined
      }) => {
        console.log(data, 'group-user:unread-messages-count-events:listen')

        if (data?.addCount) {
          dispatch(
            addUnreadGroupMessageCounts({
              channelId: data?.channelId,
              count: data?.addCount || 0,
              groupId: data?.groupId
            })
          )
        }
        if (data?.count) {
          dispatch(
            updateUnreadGroupMessageCounts({
              count: data?.count || 0,
              groupId: data?.groupId
            })
          )
        }

        if (data?.count && data?.channelId) {
          dispatch(
            updateUnreadChannelMessageCounts({
              channelId: data?.channelId,
              value: true
            })
          )
        }
      }
    }
  ]

  useSocketEvents(socket, events, isConnected)

  return (
    <MessagingContext.Provider
      value={{
        groupRealTimeData,
        setGroupRealTimeData,
        socket,
        groupChannelMessagesData,
        setChannelMessagesData
      }}
    >
      {children}
    </MessagingContext.Provider>
  )
}

export { MessageingProvider, MessagingContext }
