'use client'

import { useSettingModal } from '@/contexts/modal-setting'
import { usePathname, useRouter } from 'next/navigation'
import CustomAvatar from '@/components/custom/CustomAvatar'
import { MessageCircle } from 'lucide-react'
import { X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { FiMoreHorizontal } from 'react-icons/fi'

const DetailsModal = () => {
  const { toggleModal, modalData, modals } = useSettingModal()
  const pathName = usePathname()
  const [activeRoute, setActiveRoute] = useState(
    ['basic', 'other'].includes(pathName) ? pathName : 'basic'
  )

  const router = useRouter()

  const sections = [
    {
      name: 'basic',
      title: 'Basic',
      path: 'basic'
    },
    {
      name: 'other',
      title: 'Other',
      path: 'other'
    }
  ]

  const user = modalData.detailsModal

  return (
    <div
      className={`fixed inset-0 z-[100] items-center justify-center ${
        modals?.detailsModal ? 'flex' : ' hidden'
      }`}
    >
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={() => toggleModal('detailsModal')}
      />

      <div className='flex left-0 w-full text-[12px] right-0 top-0 bottom-0 items-center justify-center z-[101] max-w-md'>
        <div className='flex flex-col w-full'>
          <div className='flex flex-col bg-white rounded-t-[10px] rounded-b-[10px] mt-10 relative'>
            <div className='bg-gradient-to-r flex justify-end p-10 rounded-t-[10px] rounded-b-[10px] h-[100px] bg-[#F9F6F7] relative'>
              <div className='top-4 right-4 flex items-center gap-2'>
                <button
                  onClick={() => toggleModal('detailsModal')}
                  className='bg-white rounded-full border p-1'
                >
                  <FiMoreHorizontal className='size-[24px] text-black' />
                </button>
                <button
                  onClick={() => toggleModal('detailsModal')}
                  className='bg-white rounded-full border p-1'
                >
                  <X className='size-[24px] text-black' />
                </button>
              </div>
            </div>

            <div className='p-10'>
              <div className='flex flex-col md:flex-row items-start justify-between'>
                <div className='flex items-center gap-5 -mt-20'>
                  <div className='flex flex-col'>
                    <CustomAvatar
                      image={user?.profileImage}
                      className='justify-start'
                      imageClassName='h-[80px] object-top text-[40px] font-bold text-primary border w-[80px] rounded-[12px] overflow-hidden flex items-center justify-center'
                      labelClassName='h-[80px] w-[80px] rounded-[12px] overflow-hidden flex items-center justify-center'
                      alt='profile image'
                      showText={false}
                      disabled={true}
                      iconClassName='size-[36px]'
                      isCurrentUser={false}
                      userFullName={`${user?.firstName} ${user?.lastName}`}
                    />
                    <div className='flex items-center gap-2 justify-center mt-2'>
                      <span className='text-[22px] font-medium'>
                        {user?.firstName} {user?.lastName}
                      </span>
                      {user?.firstName && user?.lastName && (
                        <span className='h-2 w-2 rounded-full bg-green-500'></span>
                      )}
                    </div>
                    <span className='opacity-50'>@{user?.userName}</span>
                  </div>
                </div>

                <div className='flex flex-row items-center gap-2 justify-end ml-auto mt-4 md:mt-0 w-full md:w-auto relative bottom-9'>
                  <div className='relative'>
                    <button
                      onClick={() => {
                        toggleModal('detailsModal')
                        router.push(`/dms/${user?.id}`)
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
                  <button className='bg-primary text-white rounded-[5px] text-[16px] px-5 py-3 flex items-center gap-2 whitespace-nowrap'>
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

              <div className='bg-[#F9F6F7] rounded-[10px] mt-6 p-6 space-y-6'>
                <nav className='pt-4'>
                  <ul className='flex flex-wrap justify-start'>
                    {sections.map(route => (
                      <li key={route.name}>
                        <button
                          className={`px-5 py-2 duration-300 transition-all border-b-2 font-bold text-[15px] ${
                            activeRoute === route.path
                              ? 'border-primary'
                              : 'border-gray-200'
                          }`}
                          onClick={() => setActiveRoute(route.path)}
                        >
                          {route.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className='flex flex-wrap justify-start'>
                  <div className='pb-10 pl-5'>
                    <div className='mb-2'>
                      <h2 className='text-left font-semibold '>Member since</h2>
                      <p className='text-left'>2025</p>
                    </div>
                    <h2 className='font-semibold text-left'>
                      Membership & Subscriptions
                    </h2>
                    <p className='mb-5 text-left'>paid</p>
                    <h2 className='font-semibold text-left'>
                      Total Contributions
                    </h2>
                    <div className='flex space-x-4'>
                      <p> UGX 50,000 </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsModal
