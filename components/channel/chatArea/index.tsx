import Message from './Message'
import MessageTime from './MessageTime'
import { useParams } from 'next/navigation'
import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import ChatAreaHeader from './ChatAreaHeader'
import ChatAreaLayout from './layout'
import {
  addMoreMessages,
  fetchGroupMessages,
  fetchGroupMoreMessages
} from '@/lib/features/groups/groupMessageSlice'
import { MessagesPagination, MessageType } from '@/api/messaging/group'
import useMessaging from '@/hooks/useMessaging'

export default function ChatArea () {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { groupId, channelId } = useParams()
  const dispatch = useAppDispatch()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [prevScrollHeight, setPrevScrollHeight] = useState(0)
  const [isAtBottonArea, setIsAtBottonArea] = useState(true)
  const allGroupMembers = useAppSelector(state => state?.groupMembers.members)
  const members = useMemo(() => {
    return allGroupMembers?.[groupId as string] || []
  }, [allGroupMembers])

  const { socket } = useMessaging()

  console.log(prevScrollHeight)
  const messages = useAppSelector(
    (state: RootState) =>
      state.groupMessage.channelMessages?.[groupId as string]?.[
        channelId as string
      ]?.messages
  )

  const isFetchingMessages = useAppSelector(
    (state: RootState) =>
      state.groupMessage.groupLoading?.[groupId as string]?.[
        channelId as string
      ]?.messages ?? false
  )

  const pagination = useAppSelector(
    (state: RootState) =>
      state.groupMessage.channelMessages?.[groupId as string]?.[
        channelId as string
      ]?.pagination
  )

  const isFetching = useAppSelector(
    (state: RootState) =>
      state.groupMessage.groupMoreLoading?.[groupId as string]?.[
        channelId as string
      ]?.messages ?? false
  )
  const channel = useAppSelector(state =>
    state.group?.groups[groupId as string]?.channels.find(
      item => item.id === channelId
    )
  )

  const access = channel?.access

  const handleScrolling = async () => {
    if (!access) return
    if (chatContainerRef.current) {
      const scrollTop = chatContainerRef.current.scrollTop
      const scrollHeight = chatContainerRef.current.scrollHeight
      const clientHeight = chatContainerRef.current.clientHeight
      setPrevScrollHeight(scrollHeight)

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setIsAtBottonArea(true)
      } else {
        setIsAtBottonArea(false)
      }
      if (pagination?.hasPreviousPage) {
        if (
          scrollTop < 230 &&
          messages.length > 0 &&
          !(isFetchingMessages || isFetching)
        ) {
          const response = await dispatch(
            fetchGroupMoreMessages({
              groupId: groupId as string,
              channelId: channelId as string,
              params: {
                currentPage: pagination?.currentPage - 1,
                pageSize: 20,
                cursor: pagination?.cursor
              }
            })
          )
          const data = response?.payload as {
            pagination: MessagesPagination
            messages: MessageType[]
          }

          if (
            chatContainerRef.current &&
            messages &&
            data?.messages &&
            data?.messages.length > 0 &&
            chatContainerRef.current.scrollTop < 230
          ) {
            const heightBeforeRender = chatContainerRef.current.scrollHeight
            dispatch(
              addMoreMessages({
                groupId,
                channelId,
                messages: data?.messages,
                pagination: data?.pagination
              })
            )
            setTimeout(() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop =
                  chatContainerRef.current.scrollHeight - heightBeforeRender
              }
            }, 50)
          }
        }
        if (scrollTop + clientHeight >= scrollHeight) {
          console.log('Scrolled to bottom')
        }
      }
    }
  }

  const fetchMessages = async () => {
    if (!access || groupId == undefined || channelId == undefined) return
    if (groupId && channelId) {
      await dispatch(
        fetchGroupMessages({
          groupId: groupId as string,
          channelId: channelId as string
        })
      )
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight
      }
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [groupId, channelId, access])

  const handleScrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }
  useEffect(() => {
    if (
      messages?.filter(message => message?.messageRead?.isRead === false)
        ?.length > 0
    ) {
      socket?.emit('group:read-channel-messages-events:listen', {
        groupId,
        channelId
      })
    }
  }, [messages])

  return (
    <>
      <ChatAreaLayout
        scrollToBottom={handleScrollToBottom}
        isAtBottonArea={isAtBottonArea}
      >
        <>
          <div
            ref={chatContainerRef}
            onScroll={handleScrolling}
            className={`flex-1  max-tablet:pt-[60px] flex flex-col  overflow-y-auto  overflow-x-hidden items-end relative  h-[100dvh]  tablet-lg:h-[calc(99vh-64px)] font-inter px-2 tablet:py-6 z-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent `}
          >
            {channel?.access === false ||
            (pagination && !pagination?.hasPreviousPage) ? (
              <ChatAreaHeader />
            ) : null}
            <div className='   w-full text-center flex items-center  justify-center'>
              {isFetching === true && 'Loading...'}
            </div>

            {channel?.access &&
              messages?.map((item, index) => {
                const momentDate = moment(item.createdAt)
                const previousMessage = index > 0 ? messages[index - 1] : null
                const momentPreviousDate = previousMessage
                  ? moment(previousMessage.createdAt)
                  : null

                const isSameDay = momentPreviousDate
                  ? momentDate.isSame(momentPreviousDate, 'day')
                  : false

                const firstUnreadMessage =
                  item?.messageRead?.isRead === false &&
                  (!messages[index - 1] ||
                    messages[index - 1]?.messageRead?.isRead === true ||
                    !messages[index - 1]?.messageRead)

                return (
                  <React.Fragment key={index}>
                    <MessageTime
                      isSameDay={isSameDay}
                      hidden={isSameDay && !firstUnreadMessage}
                      timestamp={item.createdAt}
                      firstUnreadMessage={firstUnreadMessage}
                    />

                    <Message message={item} members={members} />
                  </React.Fragment>
                )
              })}
            <div className=' h-[300px] tablet:h-[500px] min-h-[250px] relative w-[20px]' />
            <div ref={bottomRef} id='bottom' />
          </div>
        </>
      </ChatAreaLayout>
    </>
  )
}
