// components/ChannelList.js
'use client'

import { IoAddOutline, IoChevronDownSharp, IoCloseSharp } from 'react-icons/io5'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useSettingModal } from '@/contexts/modal-setting'
import SkeletonLoader from './loader'
import { hasPermission } from '@/utils/permissions/auth-abac'
import Hint from '@/components/Hint'
import { UserContext } from '@/contexts/user'
import useGroup from '@/hooks/userGroup'
import { LuUserRoundPlus } from 'react-icons/lu'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { FaLock } from 'react-icons/fa6'
import { useContextSelector } from 'use-context-selector'
import GroupDropDown from './GroupDropDown'
import Channel from './Channel'
import BereavementFund from './BereavementFund'
import { FiSearch } from 'react-icons/fi'
import { MdPersonAddAlt1 } from 'react-icons/md'
import { IoCalendarSharp } from 'react-icons/io5'
import GroupSearchModal from '@/components/modal/GroupSearchModal'
import { MdMoreVert } from 'react-icons/md'
import DmList from './DmList'
import { useEffect } from 'react'
import { fetchGroupDmsList } from '@/lib/features/dms/dmSlice'
import ClubItem from './ClubItem'

export default function ChannelList () {
  const currentUser = useContextSelector(
    UserContext,
    (state: any) => state.currentUser
  )
  const { groupId, channelId } = useParams()
  const { toggleModal, updateModalData, modals, modalData, closeModal } =
    useSettingModal()
  const { hasAccess, handleToggleCollapse, collapsed } = useGroup()

  const group = useAppSelector(state => state.group.group)
  const groupLoadingData = useAppSelector(state => state.group.groupLoadingData)
  const unreadChannelMessageCounts = useAppSelector(
    state => state.groupMessage?.unreadChannelMessageCounts
  )

  const dispatch = useAppDispatch()
  const isLoading =
    (!group && groupLoadingData?.[groupId as string]) || !hasAccess

  const router = useRouter()

  const canInvite = hasPermission(
    {
      blockedBy: [],
      roles: group?.roles || [],
      id: currentUser?.id as string
    },
    'group-invitations',
    'create',
    { groupId: groupId as string }
  )

  const createBf = hasPermission(
    {
      blockedBy: [],
      roles: group?.roles || [],
      id: currentUser?.id as string
    },
    'bfs',
    'create',
    { groupId: groupId as string }
  )

  const createClub = hasPermission(
    {
      blockedBy: [],
      roles: group?.roles || [],
      id: currentUser?.id as string
    },
    'clubs',
    'create',
    { groupId: groupId as string }
  )
  const pathName = usePathname()
  const hidden =
    !!groupId && !!channelId ? true : false || !pathName.includes('/groups')

  useEffect(() => {
    dispatch(fetchGroupDmsList(groupId as string))
  }, [dispatch, groupId])
  const currentPath = window.location.pathname
  const overviewLink = `/group-savings/${groupId}/overview`

  if (isLoading) return <SkeletonLoader isLoading={hasAccess} hidden={hidden} />
  return (
    <div
      className={`${
        hidden ? 'max-tablet-lg:hidden' : ''
      } w-full tablet-lg:w-[250px] mt-[1dvh] max-tablet-lg:h-[99dvh] flex flex-col bg-white tablet-lg:bg-[#C3DBEC] z-30
      ${
        currentPath !== overviewLink
          ? 'rounded-tl-[40px] border-r border-primary/50'
          : ''
      }`}
    >
      <div className=' flex flex-col  h-[99dvh] prevent-select '>
        <div className='  max-tablet-lg:flex-col sticky top-0 tablet-lg:bg-[#C3DBEC]  rounded-tl-[40px] border-b px-4  overflow-hidden  tablet-lg:min-h-[60px] tablet-lg:h-[60px] flex items-center justify-center w-full border-primary/50'>
          <GroupDropDown canInvite={canInvite} createBf={createBf} />

          <div className=' flex relative tablet-lg:hidden w-full items-center gap-2 pb-2'>
            <div className='  flex items-center  flex-1 bg-primary text-white  px-2 rounded-[10px]'>
              <input
                type='text'
                placeholder='Search'
                value={modalData?.groupSearchModal?.search || ''}
                className=' flex-1 bg-transparent py-1 text-[14px] focus:outline-none placeholder:text-white'
                onChange={e => {
                  updateModalData('groupSearchModal', {
                    search: e.target.value
                  })
                }}
                onFocus={e => {
                  toggleModal('groupSearchModal', {
                    search: e.target.value
                  })
                }}
              />

              {modalData?.groupSearchModal?.search &&
              modals?.groupSearchModal ? (
                <button
                  className=' '
                  onClick={() => {
                    closeModal('groupSearchModal')
                  }}
                >
                  <IoCloseSharp size={20} />
                </button>
              ) : (
                <FiSearch size={20} />
              )}
            </div>

            <div className=' flex items-center  text-primary gap-2'>
              {canInvite && (
                <button
                  onClick={() => {
                    toggleModal('inviteFriendsModal')
                  }}
                >
                  <MdPersonAddAlt1 size={24} />
                </button>
              )}
              <button>
                <IoCalendarSharp size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className=' w-full tablet-lg:hidden relative bg-slate-300'>
          <GroupSearchModal className='top-auto ' />
        </div>

        <div className='overflow-y-auto h-full scrollbar-hide   '>
          <div className=' max-tablet-lg:hidden px-4 pb-10 flex justify-center'>
            {canInvite && (
              <button
                onClick={() => {
                  toggleModal('inviteFriendsModal')
                }}
                className='flex mt-2 justify-between border-b border-black/20 text-[14px]  items-center  gap-2  duration-100 transition-all  w-full p-2 py-4'
              >
                <span>Invite friends</span>
                <LuUserRoundPlus className=' size-[18px]' />
              </button>
            )}
          </div>
          <div className='  max-tablet-lg:mt-4'>
            <button className=' px-4 text-[#5E6772] font-medium w-full  flex items-center  gap-2 tablet-lg:justify-between'>
              <span>Channels</span>

              <Hint label='create channel'>
                <button onClick={() => toggleModal('createChannelModal')}>
                  <IoAddOutline size={20} />
                </button>
              </Hint>
            </button>
            <div className=' px-4 pt-2 text-[14px]'>
              <button
                onClick={() => handleToggleCollapse('groups-public')}
                className=' flex items-center gap-1 text-divider-300'
              >
                <IoChevronDownSharp
                  size={16}
                  className={`${
                    collapsed['groups-public'] ? ' -rotate-90 ' : ' rotate-0'
                  } duration-300 `}
                />
                <span>Public channels</span>
              </button>
              <div
                className={` ${
                  collapsed[`groups-public`] ? ' hidden' : ' flex'
                } mt-2 flex flex-col gap-2 text-divider-300`}
              >
                {group?.channels.map((channel, index) => {
                  const unread =
                    unreadChannelMessageCounts?.[channel.id] || false
                  if (channel.privacy === 'PUBLIC')
                    return (
                      <Channel
                        key={index}
                        channel={channel}
                        unread={unread}
                        activeChannelId={channelId as string}
                      />
                    )
                })}
              </div>
            </div>

            <div className=' px-4 pt-2 text-[14px] mt-4'>
              <button
                onClick={() => handleToggleCollapse('groups-private')}
                className=' flex w-full items-center gap-1 text-divider-300'
              >
                <IoChevronDownSharp
                  size={16}
                  className={`${
                    collapsed['groups-private'] ? ' -rotate-90 ' : ' rotate-0'
                  } duration-300 `}
                />

                <div className='flex-1 text-start'>
                  <span>Private channels</span>
                </div>

                <FaLock className=' size-[14px] text-divider-300' />
              </button>
              <div
                className={` ${
                  collapsed[`groups-private`] ? ' hidden' : ' flex'
                } mt-2 flex flex-col gap-2 text-divider-300`}
              >
                {group?.channels.map((channel, index) => {
                  const unread =
                    !!unreadChannelMessageCounts?.[channel.id] || false

                  if (channel.privacy === 'PRIVATE')
                    return (
                      <Channel
                        key={index}
                        channel={channel}
                        unread={unread}
                        activeChannelId={channelId as string}
                      />
                    )
                })}
              </div>
            </div>
          </div>

          {Number(group?.bereavementFunds?.length || 0) > 0 ? (
            <div className='  mt-10  flex-1'>
              <div className=' px-4 text-[#5E6772] font-medium w-full  flex items-center justify-between'>
                <span>Benevolent Fund</span>
                <Hint disabled={!createBf} label='Benevolent Fund'>
                  <div
                    className={` ${createBf ? '' : ' invisible'}`}
                    onClick={() => {
                      if (currentUser?.isKyc) {
                        router.push(`/bf/${groupId}/create`)
                      } else {
                        toggleModal('bfKycRequiredModal')
                      }
                    }}
                  >
                    <IoAddOutline size={20} />
                  </div>
                </Hint>
              </div>
              <div className=' px-4 pt-1 text-[14px]'>
                <div className=' mt-2 flex flex-col  gap-2 text-divider-300'>
                  {group?.bereavementFunds.map((bf, index) => {
                    return <BereavementFund key={index} bf={bf} />
                  })}
                </div>
              </div>
            </div>
          ) : null}

          <div
            onClick={() => {
              router.push(`/crowd-funding/${groupId}/create`)
            }}
            className='mt-10  flex-1'
          >
            <div className=' px-4 text-[#5E6772] font-medium w-full  flex items-center justify-between cursor-pointer'>
              <span>Crowdfund</span>
              <Hint label='Create crowdfund'>
                <div>
                  <IoAddOutline size={20} />
                </div>
              </Hint>
            </div>
          </div>

          <div
            onClick={() => router.push(overviewLink)}
            className={`px-2  flex items-center p-2 mx-2 w-auto  justify-between mt-6 font-medium text-[#5E6772] rounded-md cursor-pointer

    ${currentPath === overviewLink ? 'bg-white' : ''}`}
          >
            <span>Group Savings</span>
            <IoAddOutline size={20} />
          </div>

          {Number(group?.clubs?.length || 0) > 0 ? (
            <div className='  mt-10  flex-1'>
              <div className=' px-4 text-[#5E6772] font-medium w-full  flex items-center justify-between'>
                <span>Clubs</span>
                <Hint disabled={!createClub} label='Benevolent Fund'>
                  <div
                    className={` ${createClub ? '' : ' invisible'}`}
                    onClick={() => {
                      if (currentUser?.isKyc) {
                        router.push(`/clubs/${groupId}/create/welcome`)
                      } else {
                        toggleModal('bfKycRequiredModal')
                      }
                    }}
                  >
                    <IoAddOutline size={20} />
                  </div>
                </Hint>
              </div>
              <div className=' px-4 pt-1 text-[14px]'>
                <div className=' mt-2 flex flex-col  gap-2 text-divider-300'>
                  {group?.clubs.map((club, index) => {
                    return <ClubItem key={index} club={club} />
                  })}
                </div>
              </div>
            </div>
          ) : null}

          <div className='  mt-10  flex-1'>
            <div className='  pr-3 text-[#5E6772] font-medium w-full  flex items-center justify-between'>
              <button
                onClick={() => handleToggleCollapse('groups-dms')}
                className=' pl-3 flex items-center gap-1 text-divider-300'
              >
                <IoChevronDownSharp
                  size={16}
                  className={`${
                    collapsed['groups-dms'] ? ' -rotate-90 ' : ' rotate-0'
                  } duration-300 `}
                />
                <span>Direct Messages</span>
              </button>
              <MdMoreVert size={20} />
            </div>
            <DmList groupId={groupId as string} />
          </div>
        </div>
      </div>
    </div>
  )
}
