import { useSettingModal } from '@/contexts/modal-setting'
import { UserContext, UserContextType } from '@/contexts/user'
import { useParams, useRouter } from 'next/navigation'
import { useRef, useCallback } from 'react'
import { RxDotsVertical } from 'react-icons/rx'
import { useContextSelector } from 'use-context-selector'

const MoreActions = ({
  memberId,
  refetch,
  member,
  activeMemberActions,
  setActiveMemberAction,
  roles
}: {
  memberId: string
  refetch?: () => void
  member: {
    id: string
    fullName: string
  }
  roles: string[]
  activeMemberActions: string | null
  setActiveMemberAction: (memberId: string | null) => void
}) => {
  const moreActions = activeMemberActions === memberId
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const groupId = useParams().groupId as string

  const channelId = useParams().channelId as string
  const { toggleModal, modalData, closeModal } = useSettingModal()
  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  )

  const isCurrentUser = currentUser?.id === memberId

  const handleClickOutside = useCallback(
    (event: React.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setActiveMemberAction(null)
      }
    },
    [setActiveMemberAction]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMemberAction(null)
      }
    },
    [setActiveMemberAction]
  )

  const handleMenuItemClick = (action: () => void) => {
    action()
    setActiveMemberAction(null)
  }

  const toggleDropdown = () => {
    setActiveMemberAction(moreActions ? null : memberId)
  }

  const hidden = !channelId || isCurrentUser

  const isAdmin = roles.includes('ADMIN')
  const isOwner = roles.includes('OWNER')

  const router = useRouter()

  return (
    <>
      {/* Backdrop overlay when dropdown is open */}
      {moreActions && (
        <div
          className='fixed inset-0 z-[9999]'
          onClick={handleClickOutside}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        />
      )}

      <div
        className={` absolute items-center justify-center right-2 h-full ${
          hidden
            ? ' hidden'
            : ' group-hover:flex  group-active:flex hover:flex active:flex'
        } ${moreActions ? 'z-[10000]' : 'z-auto'}`}
      >
        <div className=' flex items-center   relative  flex-1  h-full flex-col justify-center'>
          <div className='relative'>
            <div
              ref={triggerRef}
              onClick={toggleDropdown}
              className={`p-[4px] relative rounded bg-gray-100 cursor-pointer hover:bg-gray-200 ${
                moreActions ? 'z-[10001]' : 'z-[9999]'
              }`}
            >
              <RxDotsVertical className='size-4' />
            </div>

            {moreActions && (
              <div
                ref={dropdownRef}
                className='absolute right-0 top-full mt-2 w-56 bg-white border rounded-[5px] border-gray-200 text-[14px] shadow-lg z-[10002]'
                onKeyDown={handleKeyDown}
                tabIndex={0}
              >
                {!isCurrentUser && (
                  <>
                    <div className='px-4 py-[7px] cursor-pointer font-inter text-[#797979] text-[12px] hover:bg-gray-50 transition-colors'>
                      Info
                    </div>
                    <button
                      onClick={() => {
                        router.push(`/dms/${memberId}`)
                        toggleDropdown()
                        closeModal('groupDetailsModal')
                      }}
                      className='px-4 py-[7px] w-full cursor-pointer font-inter text-[#797979] text-[12px] hover:bg-gray-50 transition-colors'
                    >
                      Message
                    </button>

                    {!isOwner && (
                      <>
                        {isAdmin ? (
                          <div
                            onClick={() =>
                              handleMenuItemClick(() =>
                                toggleModal('groupAdminModal', {
                                  remove: true,
                                  userId: memberId,
                                  userFullName: member?.fullName,
                                  previous: {
                                    name: 'groupDetailsModal',
                                    data: modalData?.groupDetailsModal
                                  }
                                })
                              )
                            }
                            className='px-4 py-[7px] cursor-pointer font-inter text-[#797979] text-[12px] hover:bg-gray-50 transition-colors'
                          >
                            Remove admin role
                          </div>
                        ) : (
                          <div
                            onClick={() =>
                              handleMenuItemClick(() =>
                                toggleModal('groupAdminModal', {
                                  remove: false,
                                  userId: memberId,
                                  userFullName: member?.fullName,
                                  previous: {
                                    name: 'groupDetailsModal',
                                    data: modalData?.groupDetailsModal
                                  }
                                })
                              )
                            }
                            className='px-4 py-[7px] cursor-pointer font-inter text-[#797979] text-[12px] hover:bg-gray-50 transition-colors'
                          >
                            Make admin
                          </div>
                        )}

                        <div
                          onClick={() =>
                            handleMenuItemClick(() =>
                              toggleModal('removeGroupMemberModal', {
                                previous: {
                                  name: 'groupDetailsModal',
                                  data: modalData?.groupDetailsModal
                                },
                                member: {
                                  ...member,
                                  groupId
                                },
                                refetch
                              })
                            )
                          }
                          className='px-4 py-[7px] cursor-pointer font-inter text-red-500 text-[12px] hover:bg-red-50 transition-colors'
                        >
                          Remove from group
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MoreActions
