'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { MessageCircle } from 'lucide-react'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { FiMoreHorizontal } from 'react-icons/fi'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getOtherUserProfile } from '@/api/user'
import MessageSection from './sections/MessageSection'
import AboutSection from './sections/AboutSection'
import { approveBfRequest, declineBfRequest } from '@/api/bereavement-fund/fund'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AuthButton from '@/components/button/AuthButton'
import { queryClient } from '@/contexts/ProviderWrapper'

const ViewBfRequestModal = () => {
  const { toggleModal, modalData, modals } = useSettingModal()
  const [activeRoute, setActiveRoute] = useState('message')
  const { bfId } = useParams()
  const sections = [
    { name: 'message', title: 'Message', path: 'message' },
    { name: 'about', title: 'About Me', path: 'about' },
    {
      name: 'mutualFriends',
      title: 'Mutual Friends',
      path: 'mutualFriends'
    },
    {
      name: 'mutualGroups',
      title: 'Mutual Groups',
      path: 'mutualGroups'
    }
  ]

  const userId = modalData.viewBfRequestModal?.user?.id
  const requestData = modalData.viewBfRequestModal
  const { data } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getOtherUserProfile(userId),
    enabled: !!userId
  })

  const router = useRouter()
  const user = useMemo(
    () =>
      data?.data.user || {
        id: modalData.viewBfRequestModal?.user.id,
        profile: {
          firstName: modalData.viewBfRequestModal?.user.firstName || '',
          lastName: modalData.viewBfRequestModal?.user.lastName || '',
          profileImage: modalData.viewBfRequestModal?.user.profileImage || '',
          userName: modalData.viewBfRequestModal?.user.userName || '',
          bio: modalData.viewBfRequestModal?.user.bio || ''
        }
      },
    [data?.data.user, modalData.viewBfRequestModal?.user]
  )

  const { mutate: mutateApprove, isPending: isPendingApprove } = useMutation({
    mutationFn: () => approveBfRequest(bfId as string, requestData?.id),
    onSuccess: () => {
      toggleModal('viewBfRequestModal')
      toast.success('Request Approved')
      queryClient.invalidateQueries({
        queryKey: ['bf-access-request', bfId]
      })
      queryClient.invalidateQueries({
        queryKey: ['-bf-members-', bfId]
      })
    }
  })
  const { mutate: mutateDecline, isPending: isPendingDecline } = useMutation({
    mutationFn: () => declineBfRequest(bfId as string, requestData?.id),
    onSuccess: () => {
      toast.success('Request Declined')
      queryClient.invalidateQueries({
        queryKey: ['bf-access-request', bfId]
      })
      queryClient.invalidateQueries({
        queryKey: ['-bf-members-', bfId]
      })
    }
  })

  //
  return (
    <div
      className={`fixed inset-0 z-[100]  items-center justify-center ${
        modals?.viewBfRequestModal ? 'flex' : ' hidden'
      }`}
    >
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={() => toggleModal('viewBfRequestModal')}
      />

      <div className='flex left-0 w-full text-[12px] right-0 top-0 bottom-0 items-center justify-center z-[101] max-w-xl'>
        <div className='flex flex-col w-full'>
          <div className='flex flex-col w-full max-w-[600px] bg-white rounded-t-[10px] rounded-b-[10px] mt-10 relative'>
            <div className='bg-gradient-to-r flex justify-end p-10 rounded-t-[10px] rounded-b-[10px] h-[100px] bg-[#F9F6F7]/75 relative'>
              <div className=' top-4 right-4 flex items-center gap-2'>
                <button
                  onClick={() => toggleModal('viewFullProfileModal')}
                  className=' bg-white rounded-full border p-1'
                >
                  <FiMoreHorizontal className=' size-[24px] text-black' />
                </button>
                <button
                  onClick={() => toggleModal('viewFullProfileModal')}
                  className=' bg-white rounded-full border p-1'
                >
                  <X className=' size-[24px] text-black' />
                </button>
              </div>
            </div>

            <div className='p-10'>
              <div className='flex flex-col md:flex-row items-start justify-between'>
                <div className='flex items-center gap-5 -mt-20'>
                  <div className='flex flex-col'>
                    <CustomAvatar
                      image={user?.profile?.profileImage}
                      className='justify-start'
                      imageClassName='h-[80px] object-top text-[40px] font-bold text-primary border  w-[80px] rounded-[12px] overflow-hidden flex items-center justify-center  group-hover:opacity-100'
                      labelClassName='h-[80px] w-[80px] rounded-[12px] overflow-hidden flex items-center justify-center'
                      alt='profile image'
                      showText={false}
                      disabled={true}
                      iconClassName='size-[36px]'
                      isCurrentUser={false}
                      userFullName={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                    />
                    <div className='flex items-center gap-2 justify-center mt-2'>
                      <span className='text-[22px] font-medium'>
                        {user?.profile?.firstName} {user?.profile?.lastName}
                      </span>
                      {user?.profile?.firstName && user?.profile?.lastName && (
                        <span className='h-2 w-2 rounded-full bg-green-500'></span>
                      )}
                    </div>
                    <span className='opacity-50'>
                      @{user?.profile?.userName}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-2 mt-4 md:mt-0'>
                  <div className='relative pt-2'>
                    <button
                      onClick={() => {
                        toggleModal('viewBfRequestModal')
                        router.push(`/dms`)
                      }}
                      className='text-white rounded-[5px] text-[16px]'
                    >
                      <MessageCircle
                        size={46}
                        color='black'
                        style={{ transform: 'rotate(270deg)' }}
                        className='border border-black rounded p-3'
                      />
                    </button>
                  </div>
                  <button className='bg-primary text-white rounded-[5px] text-[16px] px-5 py-3 flex items-center gap-2'>
                    <Image
                      src='/icon/userplusicon.svg'
                      alt='Message'
                      width={25}
                      height={25}
                    />
                    Add Friend
                  </button>
                </div>
              </div>

              <div className='bg-[#F9F6F7]/75 rounded-[10px] mt-6 p-6 space-y-6'>
                <nav className='pt-4'>
                  <ul className='grid grid-cols-4 justify-start '>
                    {sections.map(route => (
                      <li
                        className={`text-center duration-300 transition-all border-b-2 font-bold text-[12px] ${
                          activeRoute === route.path
                            ? 'border-primary'
                            : 'border-gray-200'
                        }`}
                        key={route.name}
                      >
                        <button
                          className={`flex-1 py-2 duration-300 transition-all `}
                          onClick={() => setActiveRoute(route.path)}
                        >
                          {route.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                {activeRoute === 'message' && (
                  <MessageSection message={requestData?.message || ''} />
                )}
                {activeRoute === 'about' && (
                  <AboutSection bio={user?.profile?.bio} />
                )}
              </div>
              {requestData?.status !== 'APPROVED' && (
                <div className='flex items-center mt-2 gap-4'>
                  <AuthButton
                    text='Approve'
                    isLoading={isPendingApprove}
                    handleClick={() => mutateApprove()}
                    className=' rounded-[5px] text-[14px] h-[40px] px-2 text-white'
                  />
                  {requestData?.status !== 'PENDING' && (
                    <AuthButton
                      className=' bg-red-600 rounded-[5px] text-[14px] h-[40px] px-2 text-white'
                      text='Decline'
                      isLoading={isPendingDecline}
                      handleClick={() => mutateDecline()}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewBfRequestModal
