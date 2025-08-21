import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { fetchGroupDmsList } from '@/lib/features/dms/dmSlice'
import { GroupDmConversation } from '@/types/dms'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface DmListProps {
  groupId: string
}

const DmList: React.FC<DmListProps> = ({ groupId }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Access the data from state
  const groupConversations = useAppSelector(
    state => state.dm.groupConversations[groupId]
  )
  const isLoading = useAppSelector(
    state => state.dm.loading.fetchGroupDmsList[groupId]
  )

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupDmsList(groupId))
    }
  }, [dispatch, groupId])

  const renderConversationItem = (conversation: GroupDmConversation) => {
    const { otherUser } = conversation

    return (
      <div
        key={conversation.id}
        className='px-3 py-2 cursor-pointer'
        onClick={() => {
          router.push(`/dms/${otherUser.id}`)
        }}
      >
        <div
          className={`flex items-center gap-3 px-2 py-1 
              hover:bg-gray-100`}
        >
          <div className='w-[30px] h-[30px] shrink-0'>
            {otherUser.profileImage ? (
              <Image
                width={400}
                height={400}
                src={otherUser.profileImage}
                alt={`${otherUser.firstName} ${otherUser.lastName}`}
                className='w-full h-full rounded-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-gray-300 rounded-full flex items-center justify-center'>
                <span className='text-xs font-medium text-gray-600'>
                  {otherUser.firstName.charAt(0)}
                  {otherUser.lastName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-2 flex-1'>
            <span className='font-inter text-sm whitespace-nowrap text-gray-700'>
              {otherUser.firstName} {otherUser.lastName}
            </span>
            {otherUser.username && (
              <span className='text-xs text-gray-400'>
                @{otherUser.username}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
        <div className='w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4'></div>
        <p className='text-xs text-gray-500'>Loading conversations...</p>
      </div>
    )
  }

  if (!groupConversations || groupConversations.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
        <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
          <svg
            className='w-6 h-6 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </div>
        <h3 className='text-sm font-medium text-gray-700 mb-1'>
          No direct messages yet
        </h3>
        <p className='text-xs text-gray-500 max-w-[180px]'>
          Start a conversation with someone to see your direct messages here
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      {groupConversations.map(renderConversationItem)}
    </div>
  )
}

export default DmList
