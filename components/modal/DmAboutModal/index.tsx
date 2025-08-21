'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import { useState } from 'react'
import About from './sections/About'
import Media from './sections/Media'
import Links from './sections/Links'
import Files from './sections/Files'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { IoCloseOutline } from 'react-icons/io5'
import { CiStar } from 'react-icons/ci'
import { GoBell } from 'react-icons/go'
import { MdBlockFlipped } from 'react-icons/md'
import { CiFlag1 } from 'react-icons/ci'
import Edit from './sections/Edit'
import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '@/api/user'
import { useParams } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { useContextSelector } from 'use-context-selector'
import { UserContext } from '@/contexts/user'

const DmAboutModal = () => {
  const { modals, toggleModal, modalData } = useSettingModal()
  const dmAboutModal = modals.dmAboutModal

  const [activeTab, setActiveTab] = useState<
    'about' | 'media' | 'links' | 'Files'
  >('about')
  const [showEditModal, setShowEditModal] = useState(false)

   const currentUser = useContextSelector(
    UserContext,
    (state) => state.currentUser
  );

  const otherUserId = useParams().otherUserId as string

  const dms = useAppSelector(state => state.dm.dms)

  const dm = dms[otherUserId]

  const topic = currentUser?.id ? dm?.topics?.[currentUser.id] : undefined;

  const handleToggleModal = () => {
    toggleModal('dmAboutModal')
  }

  const openEditModal = () => {
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
  }
  const user = modalData.dmAboutModal

  const { data } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () =>
      getUserProfile(user?.id, {
        with_mutual_guilds: true
      }),
    enabled: !!user?.id && !!modals?.dmAboutModal
  })

  // Use actual user data instead of hardcoded dm array
  const displayUser = data?.data.user || undefined

  return (
    <>
      <div
        className={`${
          dmAboutModal ? 'max-tablet-lg:hidden flex' : 'hidden'
        } fixed left-0 w-full right-0 top-0 bottom-0 items-center justify-center z-30`}
      >
        <button
          onClick={handleToggleModal}
          className={`w-full z-0 fixed h-full bg-black bg-opacity-[75%] ${
            dmAboutModal ? 'flex' : 'hidden'
          }`}
        />

        <div className='bg-white z-20 duration-500 transition-all relative w-[500px] mt-10 font-inter rounded-lg rounded-bl-none overflow-hidden shadow-lg'>
          <button
            onClick={handleToggleModal}
            className='absolute top-3 right-3 text-gray-500 hover:text-primary z-50'
          >
            <IoCloseOutline size={24} />
          </button>

          <div className='flex flex-col gap-4 px-6 py-4 mt-4'>
            <div className='flex items-start gap-3'>
              <div className='shrink-0'>
                <CustomAvatar
                  image={displayUser?.profileImage}
                  className='justify-start w-[60px] h-[60px] shrink-0 rounded-[5px]'
                  imageClassName='h-[60px] object-top text-[16px] font-bold text-primary border w-[60px] rounded-[5px] overflow-hidden flex items-center justify-center'
                  labelClassName='h-[60px] border-none w-[60px] rounded-[5px] overflow-hidden flex items-center justify-center'
                  alt='profile image'
                  showText={false}
                  iconClassName='w-[20px] h-[20px]'
                  disabled={true}
                  userFullName={`${displayUser?.firstName} ${displayUser?.lastName}`}
                  isCurrentUser={false}
                />
              </div>

              <div className='flex flex-col'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-[16px] text-primary'>
                    {displayUser?.firstName} {displayUser?.lastName}
                  </span>
                  <div className='w-2.5 h-2.5 rounded-full bg-green-600' />
                </div>

                <h1
                  onClick={() =>
                    toggleModal('viewFullProfileModal', displayUser)
                  }
                  className='text-[14px] text-gray-600 mt-1 cursor-pointer'
                >
                  View profile
                </h1>
              </div>
            </div>

            <div className='flex flex-nowrap items-center justify-start gap-x-2 px-1'>
              <div className='flex items-center gap-1 border border-gray-300 rounded-md px-1.5 py-0.5 text-xs'>
                <CiStar size={14} />
                <span className='font-inter'>Favourite</span>
              </div>
              <div className='flex items-center gap-1 border border-gray-300 rounded-md px-1.5 py-0.5 text-xs'>
                <GoBell size={14} />
                <span className='font-inter'>Mute</span>
              </div>
              <div className='flex items-center gap-1 border border-gray-300 rounded-md px-1.5 py-0.5 text-xs'>
                <GoBell size={14} />
                <span className='font-inter'>Archive</span>
              </div>
              <div className='flex items-center gap-1 border border-gray-300 rounded-md px-1.5 py-0.5 text-xs'>
                <MdBlockFlipped size={14} />
                <span className='font-inter'>Block</span>
              </div>
              <div className='flex items-center gap-1 border border-gray-300 rounded-md px-1.5 py-0.5 text-xs'>
                <CiFlag1 size={14} />
                <span className='font-inter'>Report</span>
              </div>
            </div>
          </div>

          <div className='flex items-end justify-start gap-4 px-6 border-b border-gray-300'>
            <button
              className={`pb-1 pt-1 font-semibold text-sm border-b-2 ${
                activeTab === 'about'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>

            <button
              className={`pb-1 pt-1 font-semibold text-sm border-b-2 ${
                activeTab === 'media'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('media')}
            >
              Media
            </button>
            <button
              className={`pb-1 pt-1 font-semibold text-sm border-b-2 ${
                activeTab === 'links'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('links')}
            >
              Links
            </button>
            <button
              className={`pb-1 pt-1 font-semibold text-sm border-b-2 ${
                activeTab === 'Files'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('Files')}
            >
              Files
            </button>
          </div>

          <div className='w-full h-full relative'>
            {activeTab === 'about' ? (
              <About topic={topic} user={data?.data.user} openEditModal={openEditModal} />
            ) : activeTab === 'media' ? (
              <Media />
            ) : activeTab === 'links' ? (
              <Links />
            ) : (
              <Files />
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75'>
          <div className='bg-white rounded-lg w-full max-w-md mx-4'>
            <Edit conversationId={dm?.id} onClose={closeEditModal} initialTopic={topic} />
          </div>
        </div>
      )}
    </>
  )
}

export default DmAboutModal
